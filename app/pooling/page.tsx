'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  MapPin, 
  Clock,
  DollarSign,
  MessageCircle,
  UserCheck,
  Navigation,
  Star,
  Shield,
  Phone,
  Share2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAppStore } from '@/stores/appStore'

interface PoolMember {
  id: string
  name: string
  avatar: string
  rating: number
  destination: string
  distance: number
  verificationLevel: number
  estimatedFare: number
  isVerified: boolean
}

interface PoolGroup {
  id: string
  destination: string
  departureTime: string
  currentMembers: PoolMember[]
  maxMembers: number
  totalFare: number
  farePerPerson: number
  meetingPoint: string
  vehicle: {
    type: 'auto' | 'cab' | 'bike'
    model: string
    number: string
  }
  status: 'forming' | 'confirmed' | 'in_transit' | 'completed'
}

export default function PoolingPage() {
  const { currentLocation, isOnline } = useAppStore()
  const [activeTab, setActiveTab] = useState<'find' | 'active' | 'history'>('find')
  const [destination, setDestination] = useState('')
  const [availablePools, setAvailablePools] = useState<PoolGroup[]>([])
  const [activePools, setActivePools] = useState<PoolGroup[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedPool, setSelectedPool] = useState<PoolGroup | null>(null)

  useEffect(() => {
    // Mock available pools
    const mockPools: PoolGroup[] = [
      {
        id: '1',
        destination: 'Tech Park Metro',
        departureTime: '2:45 PM',
        currentMembers: [
          {
            id: '1',
            name: 'Priya S.',
            avatar: 'https://ui-avatars.com/api/?name=Priya+S&background=6366f1&color=fff',
            rating: 4.8,
            destination: 'Tech Park Gate 2',
            distance: 0.2,
            verificationLevel: 95,
            estimatedFare: 45,
            isVerified: true
          },
          {
            id: '2',
            name: 'Rahul K.',
            avatar: 'https://ui-avatars.com/api/?name=Rahul+K&background=10b981&color=fff',
            rating: 4.6,
            destination: 'Tech Park Main Building',
            distance: 0.1,
            verificationLevel: 88,
            estimatedFare: 40,
            isVerified: true
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
        status: 'forming'
      },
      {
        id: '2',
        destination: 'Airport Terminal 1',
        departureTime: '3:15 PM',
        currentMembers: [
          {
            id: '3',
            name: 'Anita D.',
            avatar: 'https://ui-avatars.com/api/?name=Anita+D&background=f59e0b&color=fff',
            rating: 4.9,
            destination: 'Domestic Terminal',
            distance: 0.3,
            verificationLevel: 92,
            estimatedFare: 120,
            isVerified: true
          }
        ],
        maxMembers: 3,
        totalFare: 360,
        farePerPerson: 120,
        meetingPoint: 'Metro Station Platform 2',
        vehicle: {
          type: 'cab',
          model: 'Maruti Dzire',
          number: 'KA02AB5678'
        },
        status: 'forming'
      }
    ]
    
    setAvailablePools(mockPools)
  }, [])

  const handleSearch = async () => {
    if (!destination.trim()) return
    
    setSearching(true)
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSearching(false)
  }

  const joinPool = (pool: PoolGroup) => {
    setSelectedPool(pool)
    
    // Add to active pools after joining
    const updatedPool = {
      ...pool,
      currentMembers: [
        ...pool.currentMembers,
        {
          id: 'user',
          name: 'You',
          avatar: 'https://ui-avatars.com/api/?name=You&background=3b82f6&color=fff',
          rating: 4.7,
          destination: destination,
          distance: 0.0,
          verificationLevel: 85,
          estimatedFare: pool.farePerPerson,
          isVerified: true
        }
      ]
    }
    
    setActivePools(prev => [...prev, updatedPool])
    setActiveTab('active')
  }

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'auto':
        return '🛺'
      case 'cab':
        return '🚗'
      case 'bike':
        return '🏍️'
      default:
        return '🚗'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'forming':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'in_transit':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
          Auto Pooling
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Share rides, split costs, reduce emissions
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { id: 'find', label: 'Find Pool', icon: Users },
          { id: 'active', label: 'Active', icon: Navigation },
          { id: 'history', label: 'History', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Find Pool Tab */}
        {activeTab === 'find' && (
          <motion.div
            key="find"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="space-y-6"
          >
            {/* Search Section */}
            <div className="card">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Where are you going?
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter destination..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="input-field"
                />
                
                <motion.button
                  onClick={handleSearch}
                  disabled={!destination.trim() || searching}
                  className="btn-primary w-full"
                  whileHover={{ scale: searching ? 1 : 1.02 }}
                  whileTap={{ scale: searching ? 1 : 0.98 }}
                >
                  {searching ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                      Finding pools...
                    </div>
                  ) : (
                    'Find Available Pools'
                  )}
                </motion.button>
              </div>
            </div>

            {/* Available Pools */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Available Pools Near You
              </h3>
              
              {availablePools.map((pool, index) => (
                <motion.div
                  key={pool.id}
                  className="card cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Pool Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getVehicleIcon(pool.vehicle.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                          {pool.destination}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>Departs {pool.departureTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pool.status)}`}>
                      {pool.status}
                    </div>
                  </div>

                  {/* Pool Members */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {pool.currentMembers.length}/{pool.maxMembers} members
                      </span>
                    </div>
                    
                    <div className="flex -space-x-2">
                      {pool.currentMembers.map((member) => (
                        <div
                          key={member.id}
                          className="relative w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden"
                        >
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                          {member.isVerified && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-gray-800 flex items-center justify-center">
                              <CheckCircle className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Empty slots */}
                      {Array.from({ length: pool.maxMembers - pool.currentMembers.length }).map((_, idx) => (
                        <div
                          key={`empty-${idx}`}
                          className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 border-dashed flex items-center justify-center"
                        >
                          <Users className="w-3 h-3 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pool Details */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        ₹{pool.farePerPerson}
                      </div>
                      <div className="text-xs text-gray-500">per person</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {pool.currentMembers.reduce((avg, member) => avg + member.rating, 0) / pool.currentMembers.length}⭐
                      </div>
                      <div className="text-xs text-gray-500">avg rating</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {Math.round(pool.currentMembers.reduce((avg, member) => avg + member.verificationLevel, 0) / pool.currentMembers.length)}%
                      </div>
                      <div className="text-xs text-gray-500">verified</div>
                    </div>
                  </div>

                  {/* Meeting Point */}
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Meet at: {pool.meetingPoint}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    onClick={() => joinPool(pool)}
                    className="btn-primary w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Join Pool - ₹{pool.farePerPerson}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Active Pools Tab */}
        {activeTab === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="space-y-4"
          >
            {activePools.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                  No Active Pools
                </h3>
                <p className="text-gray-500">
                  Join a pool to see your active rides here
                </p>
              </div>
            ) : (
              activePools.map((pool) => (
                <motion.div
                  key={pool.id}
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Pool Status Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {pool.destination}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pool.status)}`}>
                      {pool.status}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getVehicleIcon(pool.vehicle.type)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-gray-200">
                            {pool.vehicle.model}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {pool.vehicle.number}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          ₹{pool.farePerPerson}
                        </div>
                        <div className="text-xs text-gray-500">your share</div>
                      </div>
                    </div>
                  </div>

                  {/* Pool Members */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pool Members ({pool.currentMembers.length}/{pool.maxMembers})
                    </h4>
                    
                    <div className="space-y-2">
                      {pool.currentMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="font-medium text-gray-800 dark:text-gray-200">
                                {member.name}
                                {member.id === 'user' && ' (You)'}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {member.destination}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-sm">{member.rating}</span>
                            </div>
                            {member.isVerified && (
                              <Shield className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button className="flex items-center justify-center gap-2 py-2 px-3 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2 px-3 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="space-y-4"
          >
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                No Pool History
              </h3>
              <p className="text-gray-500">
                Your completed rides will appear here
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Benefits Card */}
      {activeTab === 'find' && (
        <motion.div
          className="fixed bottom-24 left-4 right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-2xl shadow-lg"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold mb-1">🌱 Eco-Friendly Travel</div>
              <div className="text-sm text-white/80">
                Save up to 60% on fare • Reduce carbon footprint
              </div>
            </div>
            <div className="text-2xl">♻️</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}