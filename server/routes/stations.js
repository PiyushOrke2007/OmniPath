const express = require('express')
const router = express.Router()

// Mock station data
const stations = [
  {
    id: 'central_station',
    name: 'Central Station',
    line: 'Blue Line',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    amenities: {
      atm: { working: true, lastUpdated: Date.now() - 300000, votes: { up: 15, down: 2 } },
      restroom: { working: true, lastUpdated: Date.now() - 600000, votes: { up: 23, down: 1 } },
      food: { working: true, lastUpdated: Date.now() - 900000, votes: { up: 45, down: 3 } },
      water: { working: true, lastUpdated: Date.now() - 1200000, votes: { up: 12, down: 1 } },
      wifi: { working: true, lastUpdated: Date.now() - 180000, votes: { up: 34, down: 5 } }
    },
    crowdLevel: 65,
    accessibilityScore: 90
  },
  {
    id: 'tech_park_metro',
    name: 'Tech Park Metro', 
    line: 'Green Line',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    amenities: {
      atm: { working: false, lastUpdated: Date.now() - 7200000, votes: { up: 2, down: 12 } },
      restroom: { working: true, lastUpdated: Date.now() - 3600000, votes: { up: 8, down: 1 } },
      food: { working: true, lastUpdated: Date.now() - 1800000, votes: { up: 15, down: 0 } },
      water: { working: false, lastUpdated: Date.now() - 5400000, votes: { up: 3, down: 8 } }
    },
    crowdLevel: 45,
    accessibilityScore: 75
  },
  {
    id: 'university_junction',
    name: 'University Junction',
    line: 'Red Line', 
    coordinates: { lat: 12.9279, lng: 77.6271 },
    amenities: {
      atm: { working: true, lastUpdated: Date.now() - 1800000, votes: { up: 18, down: 3 } },
      restroom: { working: true, lastUpdated: Date.now() - 900000, votes: { up: 25, down: 0 } },
      food: { working: true, lastUpdated: Date.now() - 600000, votes: { up: 12, down: 1 } },
      water: { working: true, lastUpdated: Date.now() - 1800000, votes: { up: 16, down: 2 } },
      accessibility: { working: true, lastUpdated: Date.now() - 1200000, votes: { up: 22, down: 0 } }
    },
    crowdLevel: 80,
    accessibilityScore: 95
  }
]

// GET /api/stations - Get all stations
router.get('/', (req, res) => {
  const { search, filter } = req.query
  
  let filteredStations = stations
  
  if (search) {
    filteredStations = stations.filter(station => 
      station.name.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  if (filter === 'accessible') {
    filteredStations = filteredStations.filter(station => station.accessibilityScore >= 90)
  } else if (filter === 'nearby') {
    // Mock nearby filter - in production would use user location
    filteredStations = filteredStations.slice(0, 2)
  }
  
  res.json({
    success: true,
    stations: filteredStations,
    metadata: {
      total: filteredStations.length,
      searchTime: Date.now()
    }
  })
})

// GET /api/stations/:id - Get specific station details
router.get('/:id', (req, res) => {
  const station = stations.find(s => s.id === req.params.id)
  
  if (!station) {
    return res.status(404).json({
      error: 'Station not found'
    })
  }
  
  res.json({
    success: true,
    station
  })
})

// POST /api/stations/:id/amenities/:amenity/vote - Vote on amenity status
router.post('/:id/amenities/:amenity/vote', (req, res) => {
  const { id, amenity } = req.params
  const { vote } = req.body // 'up' or 'down'
  
  const station = stations.find(s => s.id === id)
  
  if (!station) {
    return res.status(404).json({ error: 'Station not found' })
  }
  
  if (!station.amenities[amenity]) {
    return res.status(404).json({ error: 'Amenity not found' })
  }
  
  if (!['up', 'down'].includes(vote)) {
    return res.status(400).json({ error: 'Invalid vote type' })
  }
  
  try {
    // Update vote count
    station.amenities[amenity].votes[vote]++
    station.amenities[amenity].lastUpdated = Date.now()
    
    // Auto-update working status based on votes
    const { up, down } = station.amenities[amenity].votes
    if (up + down >= 5) {
      station.amenities[amenity].working = up > down
    }
    
    res.json({
      success: true,
      amenity: station.amenities[amenity],
      message: 'Vote recorded successfully'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to record vote',
      message: error.message
    })
  }
})

module.exports = router