const express = require('express')
const router = express.Router()

// Mock karma data storage
let userKarma = new Map()
let achievements = new Map()
let rewards = new Map()

// GET /api/karma/:userId - Get user karma data
router.get('/:userId', (req, res) => {
  const { userId } = req.params
  
  const karma = userKarma.get(userId) || {
    userId,
    commuteKarmaPoints: 850,
    greenPoints: 320,
    totalCarbonSaved: 125.5,
    currentStreak: 12,
    longestStreak: 28,
    totalTrips: 89,
    ecoTrips: 76,
    poolTrips: 34,
    publicTransitTrips: 42,
    level: {
      current: 3,
      name: 'Eco Warrior',
      nextLevel: 4,
      pointsToNext: 150
    },
    monthlyStats: {
      carbonSaved: 23.8,
      moneySaved: 450,
      timeInTransit: 1560, // minutes
      ecoScore: 87
    },
    updatedAt: Date.now()
  }
  
  res.json({
    success: true,
    karma
  })
})

// POST /api/karma/add-points - Add karma points for eco-friendly activities
router.post('/add-points', (req, res) => {
  const { userId, activity, points, carbonSaved, metadata } = req.body
  
  if (!userId || !activity || !points) {
    return res.status(400).json({
      error: 'Missing required fields: userId, activity, points'
    })
  }
  
  try {
    const karma = userKarma.get(userId) || {
      commuteKarmaPoints: 0,
      greenPoints: 0,
      totalCarbonSaved: 0,
      currentStreak: 0,
      totalTrips: 0
    }
    
    // Add points based on activity
    karma.commuteKarmaPoints += points
    karma.greenPoints += Math.floor(points * 0.5) // Half points as green points
    
    if (carbonSaved) {
      karma.totalCarbonSaved += carbonSaved
    }
    
    // Update streak for daily activities
    const lastActivity = karma.lastActivityDate
    const today = new Date().toDateString()
    
    if (!lastActivity || lastActivity !== today) {
      karma.currentStreak += 1
      karma.lastActivityDate = today
    }
    
    karma.totalTrips += 1
    karma.updatedAt = Date.now()
    
    // Check for new achievements
    const newAchievements = checkAchievements(userId, karma, activity)
    
    userKarma.set(userId, karma)
    
    res.json({
      success: true,
      karma,
      pointsAdded: points,
      newAchievements,
      message: `Earned ${points} karma points for ${activity}!`
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to add karma points',
      message: error.message
    })
  }
})

// GET /api/karma/:userId/achievements - Get user achievements
router.get('/:userId/achievements', (req, res) => {
  const { userId } = req.params
  
  const userAchievements = achievements.get(userId) || []
  
  // Mock available achievements
  const availableAchievements = [
    {
      id: 'public_transit_advocate',
      title: 'Public Transit Advocate',
      description: 'Use public transport 50 times',
      icon: 'train',
      progress: 34,
      maxProgress: 50,
      reward: 100,
      completed: false,
      rarity: 'common'
    },
    {
      id: 'carbon_ninja',
      title: 'Carbon Ninja',
      description: 'Save 100kg CO2 in a month',
      icon: 'leaf',
      progress: 125,
      maxProgress: 100,
      reward: 300,
      completed: true,
      rarity: 'rare'
    },
    {
      id: 'pool_pioneer',
      title: 'Pool Pioneer',
      description: 'Pool with 25 different people',
      icon: 'users',
      progress: 18,
      maxProgress: 25,
      reward: 200,
      completed: false,
      rarity: 'epic'
    }
  ]
  
  res.json({
    success: true,
    achievements: availableAchievements,
    completed: userAchievements
  })
})

// GET /api/karma/:userId/rewards - Get available rewards
router.get('/:userId/rewards', (req, res) => {
  const { userId } = req.params
  
  const karma = userKarma.get(userId) || { commuteKarmaPoints: 0 }
  
  const availableRewards = [
    {
      id: 'discount_20',
      title: '20% Off Next Ride',
      description: 'Valid for any transport mode',
      cost: 100,
      type: 'discount',
      available: karma.commuteKarmaPoints >= 100,
      validFor: '30 days'
    },
    {
      id: 'coffee_voucher',
      title: 'Coffee Voucher',
      description: 'Free coffee at partner cafes',
      cost: 150,
      type: 'voucher',
      available: karma.commuteKarmaPoints >= 150,
      validFor: '60 days'
    },
    {
      id: 'premium_access',
      title: 'Premium Features',
      description: '1 week of premium access',
      cost: 300,
      type: 'upgrade',
      available: karma.commuteKarmaPoints >= 300,
      validFor: '7 days'
    },
    {
      id: 'tree_planting',
      title: 'Plant a Tree',
      description: 'Donate to reforestation project',
      cost: 500,
      type: 'donation',
      available: karma.commuteKarmaPoints >= 500,
      validFor: 'Permanent'
    }
  ]
  
  res.json({
    success: true,
    rewards: availableRewards,
    userPoints: karma.commuteKarmaPoints
  })
})

// POST /api/karma/:userId/redeem - Redeem reward
router.post('/:userId/redeem', (req, res) => {
  const { userId } = req.params
  const { rewardId } = req.body
  
  if (!rewardId) {
    return res.status(400).json({
      error: 'Missing required field: rewardId'
    })
  }
  
  try {
    const karma = userKarma.get(userId) || { commuteKarmaPoints: 0 }
    
    // Mock reward costs
    const rewardCosts = {
      discount_20: 100,
      coffee_voucher: 150,
      premium_access: 300,
      tree_planting: 500
    }
    
    const cost = rewardCosts[rewardId]
    
    if (!cost) {
      return res.status(404).json({
        error: 'Reward not found'
      })
    }
    
    if (karma.commuteKarmaPoints < cost) {
      return res.status(400).json({
        error: 'Insufficient karma points'
      })
    }
    
    // Deduct points
    karma.commuteKarmaPoints -= cost
    karma.updatedAt = Date.now()
    
    // Create redemption record
    const redemption = {
      id: `redemption_${Date.now()}`,
      userId,
      rewardId,
      cost,
      redeemedAt: Date.now(),
      status: 'active',
      code: Math.random().toString(36).substr(2, 8).toUpperCase()
    }
    
    userKarma.set(userId, karma)
    
    res.json({
      success: true,
      redemption,
      remainingPoints: karma.commuteKarmaPoints,
      message: 'Reward redeemed successfully!'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to redeem reward',
      message: error.message
    })
  }
})

// GET /api/karma/:userId/impact - Get environmental impact data
router.get('/:userId/impact', (req, res) => {
  const { userId } = req.params
  
  const karma = userKarma.get(userId) || { totalCarbonSaved: 0 }
  
  const impact = {
    totalCarbonSaved: karma.totalCarbonSaved || 125.5,
    equivalents: {
      trees: Math.floor((karma.totalCarbonSaved || 125.5) / 21.77 * 10) / 10,
      carKmAvoided: Math.floor((karma.totalCarbonSaved || 125.5) * 4.4),
      plasticBottlesSaved: Math.floor((karma.totalCarbonSaved || 125.5) * 45),
      energyConserved: Math.floor((karma.totalCarbonSaved || 125.5) * 2.2)
    },
    monthlyTrend: {
      thisMonth: 23.8,
      lastMonth: 19.2,
      change: 23.9
    },
    breakdown: {
      publicTransit: 65.2,
      pooling: 42.8,
      walking: 12.3,
      cycling: 5.2
    },
    goals: {
      monthly: 30,
      yearly: 300,
      progress: {
        monthly: 79.3,
        yearly: 41.8
      }
    }
  }
  
  res.json({
    success: true,
    impact
  })
})

// Helper function to check for achievements
function checkAchievements(userId, karma, activity) {
  const newAchievements = []
  
  // Check carbon saving achievements
  if (karma.totalCarbonSaved >= 100 && !achievements.get(userId)?.includes('carbon_ninja')) {
    newAchievements.push({
      id: 'carbon_ninja',
      title: 'Carbon Ninja',
      achievedAt: Date.now(),
      points: 300
    })
  }
  
  // Check streak achievements
  if (karma.currentStreak >= 30 && !achievements.get(userId)?.includes('streak_master')) {
    newAchievements.push({
      id: 'streak_master',
      title: 'Streak Master',
      achievedAt: Date.now(),
      points: 500
    })
  }
  
  // Add new achievements to user's collection
  if (newAchievements.length > 0) {
    const userAchievements = achievements.get(userId) || []
    achievements.set(userId, [...userAchievements, ...newAchievements])
  }
  
  return newAchievements
}

module.exports = router