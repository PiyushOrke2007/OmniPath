const express = require('express')
const router = express.Router()

// Mock weather data
let activeAlerts = []

// GET /api/weather/current - Get current weather conditions
router.get('/current', (req, res) => {
  const { lat, lng } = req.query
  
  // Mock weather data
  const weather = {
    temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
    humidity: Math.floor(Math.random() * 30) + 60, // 60-90%
    rainfall: Math.random() * 10, // 0-10mm
    windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
    condition: ['sunny', 'cloudy', 'rainy', 'foggy'][Math.floor(Math.random() * 4)],
    airQuality: {
      aqi: Math.floor(Math.random() * 200) + 50,
      category: 'moderate',
      pm25: Math.floor(Math.random() * 50) + 25
    },
    uvIndex: Math.floor(Math.random() * 8) + 1,
    timestamp: Date.now()
  }
  
  res.json({
    success: true,
    weather,
    location: { lat: parseFloat(lat), lng: parseFloat(lng) }
  })
})

// GET /api/weather/alerts - Get active weather alerts
router.get('/alerts', (req, res) => {
  res.json({
    success: true,
    alerts: activeAlerts,
    count: activeAlerts.length
  })
})

// POST /api/weather/alerts - Create new weather alert
router.post('/alerts', (req, res) => {
  const { type, severity, message, affectedAreas, duration } = req.body
  
  if (!type || !severity || !message) {
    return res.status(400).json({
      error: 'Missing required fields: type, severity, message'
    })
  }
  
  try {
    const alert = {
      id: `alert_${Date.now()}`,
      type, // rain, flood, extreme_heat, storm
      severity, // low, medium, high
      message,
      affectedAreas: affectedAreas || [],
      timestamp: Date.now(),
      expiresAt: Date.now() + (duration || 3600000), // 1 hour default
      active: true
    }
    
    activeAlerts.push(alert)
    
    // Emit real-time alert to connected clients
    req.app.get('io')?.emit('weather-alert', alert)
    
    res.json({
      success: true,
      alert,
      message: 'Weather alert created successfully'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create weather alert',
      message: error.message
    })
  }
})

// GET /api/weather/forecast - Get weather forecast
router.get('/forecast', (req, res) => {
  const { hours = 24 } = req.query
  
  const forecast = Array.from({length: parseInt(hours)}, (_, i) => {
    const hour = new Date(Date.now() + (i * 60 * 60 * 1000))
    return {
      time: hour.toISOString(),
      temperature: Math.floor(Math.random() * 10) + 22,
      rainfall: Math.random() * 5,
      windSpeed: Math.floor(Math.random() * 15) + 5,
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
      transportImpact: {
        metro: Math.random() > 0.8 ? 'delayed' : 'normal',
        bus: Math.random() > 0.7 ? 'delayed' : 'normal',
        road: Math.random() > 0.6 ? 'slow' : 'normal'
      }
    }
  })
  
  res.json({
    success: true,
    forecast,
    generatedAt: Date.now()
  })
})

// POST /api/weather/report - Report weather conditions
router.post('/report', (req, res) => {
  const { condition, location, severity, userId } = req.body
  
  if (!condition || !location) {
    return res.status(400).json({
      error: 'Missing required fields: condition, location'
    })
  }
  
  try {
    const report = {
      id: `report_${Date.now()}`,
      condition,
      location,
      severity: severity || 'medium',
      reportedBy: userId || 'anonymous',
      timestamp: Date.now(),
      verified: false
    }
    
    // Auto-generate alert for severe conditions
    if (severity === 'high') {
      const alert = {
        id: `alert_${Date.now()}`,
        type: condition,
        severity: 'high',
        message: `Severe ${condition} reported by users`,
        affectedAreas: [location.area || 'Local area'],
        timestamp: Date.now(),
        expiresAt: Date.now() + 7200000, // 2 hours
        active: true
      }
      
      activeAlerts.push(alert)
      req.app.get('io')?.emit('weather-alert', alert)
    }
    
    res.json({
      success: true,
      report,
      message: 'Weather report submitted successfully'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to submit weather report',
      message: error.message
    })
  }
})

// Clean up expired alerts periodically
setInterval(() => {
  const now = Date.now()
  activeAlerts = activeAlerts.filter(alert => alert.expiresAt > now)
}, 60000) // Check every minute

module.exports = router