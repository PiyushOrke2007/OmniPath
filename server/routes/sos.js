const express = require('express')
const router = express.Router()

// Mock SOS data storage
let activeSOSCases = []
let emergencyContacts = [
  { name: 'Emergency Services', number: '112' },
  { name: 'Women Helpline', number: '1091' },
  { name: 'Railway Security', number: '182' },
  { name: 'Police', number: '100' }
]

// POST /api/sos/activate - Activate SOS alert
router.post('/activate', (req, res) => {
  const { userId, location, type, message } = req.body
  
  if (!userId || !location) {
    return res.status(400).json({
      error: 'Missing required fields: userId, location'
    })
  }
  
  try {
    const sosCase = {
      id: `sos_${Date.now()}`,
      userId,
      location: {
        lat: location.lat,
        lng: location.lng,
        accuracy: location.accuracy || 10,
        timestamp: Date.now()
      },
      type: type || 'emergency', // emergency, medical, security, harassment
      message: message || 'Emergency assistance needed',
      status: 'active',
      activatedAt: Date.now(),
      priority: 'high',
      assignedTo: null,
      updates: [{
        timestamp: Date.now(),
        message: 'SOS alert activated',
        status: 'active'
      }]
    }
    
    activeSOSCases.push(sosCase)
    
    // Emit emergency alert to all connected clients and emergency services
    const emergencyAlert = {
      id: sosCase.id,
      type: 'emergency',
      priority: 'critical',
      location: sosCase.location,
      message: 'Emergency alert activated - immediate assistance required',
      activatedAt: sosCase.activatedAt
    }
    
    req.app.get('io')?.emit('emergency-alert', emergencyAlert)
    
    // In production, this would trigger:
    // - SMS to emergency contacts
    // - Push notifications to nearby users/authorities
    // - Integration with emergency services
    // - Location tracking activation
    
    res.json({
      success: true,
      sosCase,
      emergencyContacts,
      message: 'SOS alert activated - help is on the way'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to activate SOS alert',
      message: error.message
    })
  }
})

// POST /api/sos/deactivate - Deactivate SOS alert
router.post('/deactivate', (req, res) => {
  const { sosId, userId, reason } = req.body
  
  if (!sosId || !userId) {
    return res.status(400).json({
      error: 'Missing required fields: sosId, userId'
    })
  }
  
  try {
    const caseIndex = activeSOSCases.findIndex(c => c.id === sosId && c.userId === userId)
    
    if (caseIndex === -1) {
      return res.status(404).json({
        error: 'SOS case not found or unauthorized'
      })
    }
    
    const sosCase = activeSOSCases[caseIndex]
    sosCase.status = 'resolved'
    sosCase.resolvedAt = Date.now()
    sosCase.resolutionReason = reason || 'User deactivated'
    sosCase.updates.push({
      timestamp: Date.now(),
      message: `SOS deactivated: ${reason || 'User safe'}`,
      status: 'resolved'
    })
    
    // Remove from active cases
    activeSOSCases.splice(caseIndex, 1)
    
    // Notify connected clients
    req.app.get('io')?.emit('emergency-resolved', {
      sosId: sosCase.id,
      resolvedAt: sosCase.resolvedAt
    })
    
    res.json({
      success: true,
      sosCase,
      message: 'SOS alert deactivated successfully'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to deactivate SOS alert', 
      message: error.message
    })
  }
})

// GET /api/sos/active/:userId - Get active SOS cases for user
router.get('/active/:userId', (req, res) => {
  const { userId } = req.params
  
  const userCases = activeSOSCases.filter(c => c.userId === userId)
  
  res.json({
    success: true,
    cases: userCases,
    count: userCases.length
  })
})

// POST /api/sos/update-location - Update location during active SOS
router.post('/update-location', (req, res) => {
  const { sosId, location } = req.body
  
  if (!sosId || !location) {
    return res.status(400).json({
      error: 'Missing required fields: sosId, location'
    })
  }
  
  try {
    const sosCase = activeSOSCases.find(c => c.id === sosId)
    
    if (!sosCase) {
      return res.status(404).json({
        error: 'SOS case not found'
      })
    }
    
    // Update location
    sosCase.location = {
      ...location,
      timestamp: Date.now()
    }
    
    sosCase.updates.push({
      timestamp: Date.now(),
      message: 'Location updated',
      status: 'location_update'
    })
    
    // Emit location update to emergency responders
    req.app.get('io')?.emit('emergency-location-update', {
      sosId: sosCase.id,
      location: sosCase.location
    })
    
    res.json({
      success: true,
      location: sosCase.location,
      message: 'Location updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update location',
      message: error.message
    })
  }
})

// GET /api/sos/emergency-contacts - Get emergency contact numbers
router.get('/emergency-contacts', (req, res) => {
  res.json({
    success: true,
    contacts: emergencyContacts
  })
})

// POST /api/sos/silent-alert - Create silent monitoring alert
router.post('/silent-alert', (req, res) => {
  const { userId, location, route, estimatedArrival } = req.body
  
  if (!userId || !location || !estimatedArrival) {
    return res.status(400).json({
      error: 'Missing required fields: userId, location, estimatedArrival'
    })
  }
  
  try {
    const silentAlert = {
      id: `silent_${Date.now()}`,
      userId,
      location,
      route: route || null,
      estimatedArrival,
      status: 'monitoring',
      createdAt: Date.now(),
      checkpoints: [],
      emergencyTrigger: {
        delayThreshold: 30 * 60 * 1000, // 30 minutes
        noMovementThreshold: 15 * 60 * 1000 // 15 minutes
      }
    }
    
    // Store silent alert (would typically be in database)
    // This allows automated monitoring and emergency escalation
    
    res.json({
      success: true,
      silentAlert,
      message: 'Silent monitoring activated'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create silent alert',
      message: error.message
    })
  }
})

module.exports = router