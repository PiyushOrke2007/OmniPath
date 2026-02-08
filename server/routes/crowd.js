const express = require('express')
const router = express.Router()

// Mock crowd data storage
let crowdData = new Map()

// GET /api/crowd/:stationId - Get crowd data for a station
router.get('/:stationId', (req, res) => {
  const { stationId } = req.params
  const data = crowdData.get(stationId) || {
    stationId,
    crowdPercentage: Math.floor(Math.random() * 80) + 10,
    seatProbability: Math.floor(Math.random() * 90) + 5,
    lastUpdated: Date.now() - Math.floor(Math.random() * 300000), // Random time up to 5 minutes ago
    reports: 0
  }
  
  res.json({
    success: true,
    crowdData: data
  })
})

// POST /api/crowd/report - Report crowd data
router.post('/report', (req, res) => {
  const { stationId, crowdPercentage, seatProbability, userLocation } = req.body
  
  if (!stationId || crowdPercentage === undefined) {
    return res.status(400).json({
      error: 'Missing required fields: stationId, crowdPercentage'
    })
  }
  
  try {
    const existing = crowdData.get(stationId) || { reports: 0 }
    
    // Update crowd data with weighted average
    const newData = {
      stationId,
      crowdPercentage: Math.round((existing.crowdPercentage || 0) * 0.7 + crowdPercentage * 0.3),
      seatProbability: seatProbability || (100 - crowdPercentage),
      lastUpdated: Date.now(),
      reports: existing.reports + 1,
      contributors: (existing.contributors || []).slice(-4).concat([{
        timestamp: Date.now(),
        accuracy: Math.floor(Math.random() * 30) + 70 // Mock accuracy score
      }])
    }
    
    crowdData.set(stationId, newData)
    
    // Emit real-time update to connected clients
    req.app.get('io')?.emit('crowd-update', newData)
    
    res.json({
      success: true,
      crowdData: newData,
      message: 'Crowd data updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update crowd data',
      message: error.message
    })
  }
})

// GET /api/crowd/analytics/:stationId - Get crowd analytics
router.get('/analytics/:stationId', (req, res) => {
  const { stationId } = req.params
  
  // Mock historical crowd analytics
  const analytics = {
    stationId,
    hourlyAverages: Array.from({length: 24}, (_, hour) => ({
      hour,
      averageCrowd: Math.floor(Math.random() * 60) + 20,
      peakTimes: hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19
    })),
    weeklyTrend: {
      thisWeek: Math.floor(Math.random() * 80) + 20,
      lastWeek: Math.floor(Math.random() * 80) + 20,
      change: Math.floor(Math.random() * 20) - 10
    },
    predictions: {
      nextHour: Math.floor(Math.random() * 80) + 20,
      confidence: Math.floor(Math.random() * 30) + 70
    }
  }
  
  res.json({
    success: true,
    analytics
  })
})

module.exports = router