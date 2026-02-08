const express = require('express')
const router = express.Router()

// Mock pooling data storage
let activePools = []
let poolRequests = []

// GET /api/pooling/pools - Get available pools
router.get('/pools', (req, res) => {
  const { destination, maxDistance = 5 } = req.query
  
  let filteredPools = activePools
  
  if (destination) {
    filteredPools = activePools.filter(pool => 
      pool.destination.toLowerCase().includes(destination.toLowerCase())
    )
  }
  
  // Mock pools if none exist
  if (filteredPools.length === 0) {
    filteredPools = [
      {
        id: 'pool_1',
        destination: destination || 'Tech Park Metro',
        departureTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        currentMembers: [
          {
            id: 'user_1',
            name: 'Priya S.',
            rating: 4.8,
            verificationLevel: 95,
            isVerified: true,
            estimatedFare: 45
          },
          {
            id: 'user_2',
            name: 'Rahul K.',
            rating: 4.6,
            verificationLevel: 88,
            isVerified: true,
            estimatedFare: 40
          }
        ],
        maxMembers: 4,
        totalFare: 180,
        farePerPerson: 45,
        meetingPoint: 'Central Station Exit B',
        vehicle: {
          type: 'auto',
          model: 'Bajaj RE',
          number: 'KA01MZ1234'
        },
        status: 'forming',
        route: {
          distance: 12.5,
          duration: 35,
          stops: ['Central Station', 'Tech Hub', 'Metro Station']
        },
        createdAt: Date.now() - 600000
      }
    ]
  }
  
  res.json({
    success: true,
    pools: filteredPools,
    count: filteredPools.length
  })
})

// POST /api/pooling/create - Create new pool
router.post('/create', (req, res) => {
  const { 
    destination, 
    departureTime, 
    maxMembers, 
    meetingPoint, 
    userId, 
    userProfile,
    estimatedFare
  } = req.body
  
  if (!destination || !departureTime || !maxMembers || !userId) {
    return res.status(400).json({
      error: 'Missing required fields: destination, departureTime, maxMembers, userId'
    })
  }
  
  try {
    const pool = {
      id: `pool_${Date.now()}`,
      destination,
      departureTime,
      currentMembers: [{
        id: userId,
        ...userProfile,
        estimatedFare: estimatedFare || 50,
        joinedAt: Date.now()
      }],
      maxMembers,
      totalFare: (estimatedFare || 50) * maxMembers,
      farePerPerson: estimatedFare || 50,
      meetingPoint: meetingPoint || 'To be decided',
      vehicle: null, // Will be assigned when pool is confirmed
      status: 'forming',
      createdBy: userId,
      createdAt: Date.now(),
      route: {
        distance: Math.floor(Math.random() * 20) + 5,
        duration: Math.floor(Math.random() * 30) + 20,
        stops: ['Start Point', meetingPoint, destination]
      }
    }
    
    activePools.push(pool)
    
    // Emit pool creation to nearby users
    req.app.get('io')?.emit('new-pool-created', pool)
    
    res.json({
      success: true,
      pool,
      message: 'Pool created successfully'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create pool',
      message: error.message
    })
  }
})

// POST /api/pooling/join - Join existing pool
router.post('/join', (req, res) => {
  const { poolId, userId, userProfile } = req.body
  
  if (!poolId || !userId) {
    return res.status(400).json({
      error: 'Missing required fields: poolId, userId'
    })
  }
  
  try {
    const poolIndex = activePools.findIndex(p => p.id === poolId)
    
    if (poolIndex === -1) {
      return res.status(404).json({
        error: 'Pool not found'
      })
    }
    
    const pool = activePools[poolIndex]
    
    // Check if pool is full
    if (pool.currentMembers.length >= pool.maxMembers) {
      return res.status(400).json({
        error: 'Pool is full'
      })
    }
    
    // Check if user already in pool
    if (pool.currentMembers.some(member => member.id === userId)) {
      return res.status(400).json({
        error: 'User already in pool'
      })
    }
    
    // Add user to pool
    pool.currentMembers.push({
      id: userId,
      ...userProfile,
      estimatedFare: pool.farePerPerson,
      joinedAt: Date.now()
    })
    
    // Check if pool is full and auto-confirm
    if (pool.currentMembers.length === pool.maxMembers) {
      pool.status = 'confirmed'
      pool.confirmedAt = Date.now()
      
      // Assign vehicle (mock)
      pool.vehicle = {
        type: 'auto',
        model: 'Bajaj RE',
        number: `KA${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}MZ${Math.floor(Math.random() * 9999)}`
      }
    }
    
    // Notify all pool members
    req.app.get('io')?.emit('pool-updated', pool)
    
    res.json({
      success: true,
      pool,
      message: pool.status === 'confirmed' ? 'Pool confirmed! Vehicle assigned.' : 'Successfully joined pool'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to join pool',
      message: error.message
    })
  }
})

// POST /api/pooling/leave - Leave pool
router.post('/leave', (req, res) => {
  const { poolId, userId, reason } = req.body
  
  if (!poolId || !userId) {
    return res.status(400).json({
      error: 'Missing required fields: poolId, userId'
    })
  }
  
  try {
    const poolIndex = activePools.findIndex(p => p.id === poolId)
    
    if (poolIndex === -1) {
      return res.status(404).json({
        error: 'Pool not found'
      })
    }
    
    const pool = activePools[poolIndex]
    const memberIndex = pool.currentMembers.findIndex(m => m.id === userId)
    
    if (memberIndex === -1) {
      return res.status(400).json({
        error: 'User not in pool'
      })
    }
    
    // Remove user from pool
    pool.currentMembers.splice(memberIndex, 1)
    
    // If creator left or pool empty, cancel the pool
    if (pool.createdBy === userId || pool.currentMembers.length === 0) {
      pool.status = 'cancelled'
      pool.cancelledAt = Date.now()
      pool.cancelReason = reason || 'Creator left'
      
      // Remove from active pools
      activePools.splice(poolIndex, 1)
    } else {
      // Recalculate fare if needed
      pool.farePerPerson = Math.ceil(pool.totalFare / pool.currentMembers.length)
    }
    
    // Notify remaining members
    req.app.get('io')?.emit('pool-updated', pool)
    
    res.json({
      success: true,
      pool,
      message: pool.status === 'cancelled' ? 'Pool cancelled' : 'Successfully left pool'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to leave pool',
      message: error.message
    })
  }
})

// GET /api/pooling/user/:userId - Get user's pool history
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params
  
  // Mock user pool history
  const poolHistory = [
    {
      id: 'pool_completed_1',
      destination: 'Airport Terminal 1',
      date: Date.now() - 86400000,
      fareShare: 120,
      members: 3,
      rating: 4.8,
      status: 'completed',
      carbonSaved: 2.5
    },
    {
      id: 'pool_completed_2',
      destination: 'Tech Park',
      date: Date.now() - 172800000,
      fareShare: 45,
      members: 4,
      rating: 4.6,
      status: 'completed',
      carbonSaved: 1.8
    }
  ]
  
  const activeUserPools = activePools.filter(pool => 
    pool.currentMembers.some(member => member.id === userId)
  )
  
  res.json({
    success: true,
    activePools: activeUserPools,
    history: poolHistory,
    stats: {
      totalPools: poolHistory.length + activeUserPools.length,
      totalSavings: poolHistory.reduce((sum, pool) => sum + (pool.fareShare * 0.4), 0),
      totalCarbonSaved: poolHistory.reduce((sum, pool) => sum + pool.carbonSaved, 0),
      averageRating: poolHistory.reduce((sum, pool) => sum + pool.rating, 0) / poolHistory.length
    }
  })
})

// POST /api/pooling/rate - Rate pool experience
router.post('/rate', (req, res) => {
  const { poolId, userId, rating, feedback, ratedMembers } = req.body
  
  if (!poolId || !userId || !rating) {
    return res.status(400).json({
      error: 'Missing required fields: poolId, userId, rating'
    })
  }
  
  try {
    // In production, store rating in database
    const ratingData = {
      poolId,
      ratedBy: userId,
      rating: Math.max(1, Math.min(5, rating)),
      feedback: feedback || '',
      ratedMembers: ratedMembers || [],
      timestamp: Date.now()
    }
    
    res.json({
      success: true,
      ratingData,
      message: 'Rating submitted successfully'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to submit rating',
      message: error.message
    })
  }
})

module.exports = router