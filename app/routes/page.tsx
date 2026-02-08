'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Navigation, 
  MapPin, 
  Clock, 
  Accessibility,
  CloudRain,
  Car,
  Leaf,
  DollarSign,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { useAppStore } from '@/stores/appStore'

interface RouteOption {
  id: string
  name: string
  duration: number
  distance: number
  congestionScore: number
  weatherRisk: number
  accessibilityFriendly: boolean
  carbonFootprint: number
  cost: number
  changes: number
  modes: string[]
  highlights: string[]
  warnings: string[]
}

function RoutesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { accessibilityMode, setSelectedRoute } = useAppStore()
  
  const [routes, setRoutes] = useState<RouteOption[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  
  const from = searchParams.get('from') || ''
  const to = searchParams.get('to') || ''

  useEffect(() => {
    // Simulate route fetching
    const fetchRoutes = async () => {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockRoutes: RouteOption[] = [
        {
          id: '1',
          name: 'Fastest Route',
          duration: 45,
          distance: 12.5,
          congestionScore: 30,
          weatherRisk: 10,
          accessibilityFriendly: true,
          carbonFootprint: 2.3,
          cost: 45,
          changes: 1,
          modes: ['Metro', 'Bus'],
          highlights: ['Real-time updates', 'Climate controlled'],
          warnings: []
        },
        {
          id: '2',
          name: 'Eco-Friendly Route',
          duration: 52,
          distance: 14.2,
          congestionScore: 20,
          weatherRisk: 15,
          accessibilityFriendly: true,
          carbonFootprint: 1.1,
          cost: 38,
          changes: 2,
          modes: ['Metro', 'Electric Bus', 'Walk'],
          highlights: ['70% lower emissions', 'Green corridor'],
          warnings: ['5 min walk in between']
        },
        {
          id: '3',
          name: 'Budget Route',
          duration: 68,
          distance: 16.8,
          congestionScore: 45,
          weatherRisk: 20,
          accessibilityFriendly: false,
          carbonFootprint: 1.8,
          cost: 25,
          changes: 3,
          modes: ['Bus', 'Shared Auto', 'Bus'],
          highlights: ['Lowest cost', 'Local experience'],
          warnings: ['Moderate congestion', 'Not fully accessible']
        }
      ]
      
      setRoutes(mockRoutes)
      setLoading(false)
    }
    
    if (from && to) {
      fetchRoutes()
    }
  }, [from, to])

  const filters = [
    { id: 'fastest', label: 'Fastest', icon: Clock },
    { id: 'accessible', label: 'Accessible', icon: Accessibility },
    { id: 'weather', label: 'Weather Safe', icon: CloudRain },
    { id: 'eco', label: 'Eco-Friendly', icon: Leaf },
    { id: 'budget', label: 'Budget', icon: DollarSign },
  ]

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    )
  }

  const selectRoute = (route: RouteOption) => {
    setSelectedRoute({
      id: route.id,
      from,
      to,
      duration: route.duration,
      distance: route.distance,
      congestionScore: route.congestionScore,
      weatherRisk: route.weatherRisk,
      accessibilityFriendly: route.accessibilityFriendly,
      carbonFootprint: route.carbonFootprint,
      cost: route.cost,
    })
    
    router.push('/map')
  }

  return (
    <div className="min-h-screen pb-20 px-4 pt-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Route Options
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-3 h-3 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {from} → {to}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Route Preferences
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => {
            const Icon = filter.icon
            const isSelected = selectedFilters.includes(filter.id)
            
            return (
              <motion.button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-primary-500'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Route Results */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="card animate-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="flex gap-4">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {routes.map((route, index) => (
            <motion.div
              key={route.id}
              className={`card cursor-pointer transition-all duration-200 hover:shadow-xl ${
                accessibilityMode && route.accessibilityFriendly
                  ? 'ring-2 ring-accent-500'
                  : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => selectRoute(route)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Route Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {route.name}
                </h3>
                <div className="flex items-center gap-2">
                  {route.accessibilityFriendly && (
                    <div className="p-1 bg-green-100 text-green-600 rounded-full">
                      <Accessibility className="w-3 h-3" />
                    </div>
                  )}
                  <Navigation className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Route Stats */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <Clock className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {route.duration}m
                  </div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                
                <div className="text-center">
                  <Car className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {route.congestionScore}%
                  </div>
                  <div className="text-xs text-gray-500">Crowded</div>
                </div>
                
                <div className="text-center">
                  <Leaf className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {route.carbonFootprint}kg
                  </div>
                  <div className="text-xs text-gray-500">CO₂</div>
                </div>
                
                <div className="text-center">
                  <DollarSign className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    ₹{route.cost}
                  </div>
                  <div className="text-xs text-gray-500">Fare</div>
                </div>
              </div>

              {/* Transport Modes */}
              <div className="flex gap-2 mb-4">
                {route.modes.map((mode, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                      {mode}
                    </span>
                    {idx < route.modes.length - 1 && (
                      <span className="text-gray-400 text-xs">→</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Highlights and Warnings */}
              {route.highlights.length > 0 && (
                <div className="mb-2">
                  {route.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      {highlight}
                    </div>
                  ))}
                </div>
              )}

              {route.warnings.length > 0 && (
                <div>
                  {route.warnings.map((warning, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                      <AlertTriangle className="w-3 h-3" />
                      {warning}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RoutesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    }>
      <RoutesContent />
    </Suspense>
  )
}