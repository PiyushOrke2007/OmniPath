const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/routes', require('./routes/routes'))
app.use('/api/stations', require('./routes/stations'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/pooling', require('./routes/pooling'))
app.use('/api/weather', require('./routes/weather'))
app.use('/api/crowd', require('./routes/crowd'))
app.use('/api/karma', require('./routes/karma'))
app.use('/api/sos', require('./routes/sos'))

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  // Join user to location-based room
  socket.on('join-location', (locationData) => {
    const { lat, lng } = locationData
    const room = `location_${Math.floor(lat * 100)}_${Math.floor(lng * 100)}`
    socket.join(room)
    console.log(`User ${socket.id} joined location room: ${room}`)
  })
  
  // Handle real-time crowd reporting
  socket.on('crowd-report', (data) => {
    io.to(data.stationId).emit('crowd-update', data)
  })
  
  // Handle real-time weather alerts
  socket.on('weather-alert', (data) => {
    io.emit('weather-update', data)
  })
  
  // Handle SOS emergency alerts
  socket.on('sos-alert', (data) => {
    io.emit('emergency-alert', {
      ...data,
      timestamp: Date.now()
    })
    console.log('Emergency alert triggered:', data)
  })
  
  // Handle pooling requests
  socket.on('pool-request', (data) => {
    const room = `pool_${data.destination}`
    io.to(room).emit('pool-match', data)
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found'
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 OmniPath server running on port ${PORT}`)
  console.log(`📡 WebSocket server ready for real-time updates`)
})