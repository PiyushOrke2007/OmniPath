'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Search, 
  ThumbsUp, 
  ThumbsDown, 
  Wifi,
  Car,
  Coffee,
  Droplets,
  ShoppingCart,
  Utensils,
  Accessibility,
  CheckCircle,
  XCircle,
  Clock,
  Users
} from 'lucide-react'
import { useAppStore } from '@/stores/appStore'

interface StationAmenity {
  id: string
  name: string
  icon: React.ElementType
  status: 'working' | 'broken' | 'unknown'
  lastUpdated: number
  votes: { up: number, down: number }
  userVoted: 'up' | 'down' | null
}

interface Station {
  id: string
  name: string
  line: string
  distance: number
  amenities: StationAmenity[]
  crowdLevel: number
  accessibilityScore: number
}

export default function StationsPage() {
  const { accessibilityMode } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [stations, setStations] = useState<Station[]>([])
  const [filter, setFilter] = useState<'all' | 'accessible' | 'nearby'>('all')

  useEffect(() => {
    // Mock station data
    const mockStations: Station[] = [
      {
        id: '1',
        name: 'Central Station',
        line: 'Blue Line',
        distance: 0.2,
        crowdLevel: 65,
        accessibilityScore: 90,
        amenities: [
          {
            id: '1a',
            name: 'ATM',
            icon: Car,
            status: 'working',
            lastUpdated: Date.now() - 300000,
            votes: { up: 15, down: 2 },
            userVoted: null
          },
          {
            id: '1b',
            name: 'Restroom',
            icon: Droplets,
            status: 'working',
            lastUpdated: Date.now() - 600000,
            votes: { up: 23, down: 1 },
            userVoted: null
          },
          {
            id: '1c',
            name: 'Food Court',
            icon: Utensils,
            status: 'working',
            lastUpdated: Date.now() - 900000,
            votes: { up: 45, down: 3 },
            userVoted: null
          },
          {
            id: '1d',
            name: 'Water Fountain',
            icon: Droplets,
            status: 'working',
            lastUpdated: Date.now() - 1200000,
            votes: { up: 12, down: 1 },
            userVoted: null
          },
          {
            id: '1e',
            name: 'Free WiFi',
            icon: Wifi,
            status: 'working',
            lastUpdated: Date.now() - 180000,
            votes: { up: 34, down: 5 },
            userVoted: null
          }
        ]
      },
      {
        id: '2',
        name: 'Tech Park Metro',
        line: 'Green Line',
        distance: 1.5,
        crowdLevel: 45,
        accessibilityScore: 75,
        amenities: [
          {
            id: '2a',
            name: 'ATM',
            icon: Car,
            status: 'broken',
            lastUpdated: Date.now() - 7200000,
            votes: { up: 2, down: 12 },
            userVoted: null
          },
          {
            id: '2b',
            name: 'Restroom',
            icon: Droplets,
            status: 'working',
            lastUpdated: Date.now() - 3600000,
            votes: { up: 8, down: 1 },
            userVoted: null
          },
          {
            id: '2c',
            name: 'Snack Bar',
            icon: Coffee,
            status: 'working',
            lastUpdated: Date.now() - 1800000,
            votes: { up: 15, down: 0 },
            userVoted: null
          }
        ]
      },
      {
        id: '3',
        name: 'University Junction',
        line: 'Red Line',
        distance: 2.8,
        crowdLevel: 80,
        accessibilityScore: 95,
        amenities: [
          {
            id: '3a',
            name: 'ATM',
            icon: Car,
            status: 'working',
            lastUpdated: Date.now() - 1800000,
            votes: { up: 18, down: 3 },
            userVoted: null
          },
          {
            id: '3b',
            name: 'Accessible Restroom',
            icon: Accessibility,
            status: 'working',
            lastUpdated: Date.now() - 900000,
            votes: { up: 25, down: 0 },
            userVoted: null
          },
          {
            id: '3c',
            name: 'Bookstore',
            icon: ShoppingCart,
            status: 'working',
            lastUpdated: Date.now() - 600000,
            votes: { up: 12, down: 1 },
            userVoted: null
          }
        ]
      }
    ]
    
    setStations(mockStations)
  }, [])

  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'accessible' && station.accessibilityScore >= 90) ||
      (filter === 'nearby' && station.distance <= 1)
    
    return matchesSearch && matchesFilter
  })

  const handleVote = (stationId: string, amenityId: string, voteType: 'up' | 'down') => {
    setStations(prev => prev.map(station => {
      if (station.id === stationId) {
        return {
          ...station,
          amenities: station.amenities.map(amenity => {
            if (amenity.id === amenityId) {
              const newVotes = { ...amenity.votes }
              
              // Remove previous vote if any
              if (amenity.userVoted === 'up') newVotes.up--
              if (amenity.userVoted === 'down') newVotes.down--
              
              // Add new vote if different from previous
              if (amenity.userVoted !== voteType) {
                if (voteType === 'up') newVotes.up++
                if (voteType === 'down') newVotes.down++
              }
              
              return {
                ...amenity,
                votes: newVotes,
                userVoted: amenity.userVoted === voteType ? null : voteType,
                lastUpdated: Date.now()
              }
            }
            return amenity
          })
        }
      }
      return station
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      case 'broken':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <CheckCircle className="w-3 h-3" />
      case 'broken':
        return <XCircle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  return (
    <div className="min-h-screen pb-20 px-4 pt-8">
      {/* Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Station Amenities
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Real-time crowd-sourced station information
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="space-y-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Stations' },
            { id: 'accessible', label: 'Accessible' },
            { id: 'nearby', label: 'Nearby' },
          ].map(filterOption => (
            <motion.button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                filter === filterOption.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {filterOption.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Station List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredStations.map((station, index) => (
            <motion.div
              key={station.id}
              className="card cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedStation(
                selectedStation === station.id ? null : station.id
              )}
              whileHover={{ scale: 1.01 }}
              layout
            >
              {/* Station Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {station.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{station.line}</span>
                      <span>•</span>
                      <span>{station.distance}km away</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    station.crowdLevel < 50 ? 'text-green-600' : 
                    station.crowdLevel < 80 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {station.crowdLevel}%
                  </div>
                  <div className="text-xs text-gray-500">crowded</div>
                  
                  {accessibilityMode && (
                    <div className="flex items-center gap-1 mt-1">
                      <Accessibility className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600">
                        {station.accessibilityScore}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities Preview */}
              <div className="flex gap-2 mb-2">
                {station.amenities.slice(0, 4).map(amenity => {
                  const Icon = amenity.icon
                  return (
                    <div
                      key={amenity.id}
                      className={`p-2 rounded-lg ${getStatusColor(amenity.status)}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  )
                })}
                {station.amenities.length > 4 && (
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 text-xs flex items-center">
                    +{station.amenities.length - 4}
                  </div>
                )}
              </div>

              {/* Expanded Amenities */}
              <AnimatePresence>
                {selectedStation === station.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                      Available Amenities
                    </h4>
                    
                    <div className="space-y-3">
                      {station.amenities.map(amenity => {
                        const Icon = amenity.icon
                        
                        return (
                          <div
                            key={amenity.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${getStatusColor(amenity.status)}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              
                              <div>
                                <div className="font-medium text-gray-800 dark:text-gray-200">
                                  {amenity.name}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  {getStatusIcon(amenity.status)}
                                  <span className="capitalize">{amenity.status}</span>
                                  <span>•</span>
                                  <span>
                                    {Math.floor((Date.now() - amenity.lastUpdated) / 60000)}m ago
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Voting */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                <Users className="w-3 h-3" />
                                <span>{amenity.votes.up + amenity.votes.down}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleVote(station.id, amenity.id, 'up')
                                  }}
                                  className={`p-1.5 rounded transition-colors ${
                                    amenity.userVoted === 'up'
                                      ? 'bg-green-500 text-white'
                                      : 'hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-600 dark:text-gray-400'
                                  }`}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </button>
                                <span className="text-xs text-green-600 min-w-[12px] text-center">
                                  {amenity.votes.up}
                                </span>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleVote(station.id, amenity.id, 'down')
                                  }}
                                  className={`p-1.5 rounded transition-colors ${
                                    amenity.userVoted === 'down'
                                      ? 'bg-red-500 text-white'
                                      : 'hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400'
                                  }`}
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </button>
                                <span className="text-xs text-red-600 min-w-[12px] text-center">
                                  {amenity.votes.down}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredStations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No stations found
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </motion.div>
      )}
    </div>
  )
}