'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Navigation, 
  MapPin, 
  Clock,
  Car,
  Train,
  Bus,
  AlertCircle
} from 'lucide-react'
import { useAppStore } from '@/stores/appStore'

export default function MapPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { selectedRoute } = useAppStore()
  
  const [routeDetails, setRouteDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading route details and map data
    const timer = setTimeout(() => {
      setRouteDetails({
        path: [
          { lat: 12.9716, lng: 77.5946, name: 'Start' },
          { lat: 12.9352, lng: 77.6245, name: 'Transfer Point' },
          { lat: 12.9279, lng: 77.6271, name: 'Destination' },
        ],
        steps: [
          {
            mode: 'walk',
            instruction: 'Walk to Central Station',
            duration: 5,
            distance: 0.3
          },
          {
            mode: 'metro',
            instruction: 'Take Blue Line to Tech Park',
            duration: 25,
            distance: 8.5,
            stops: ['City Center', 'Mall Junction', 'Tech Hub']
          },
          {
            mode: 'walk',
            instruction: 'Walk to destination',
            duration: 3,
            distance: 0.2
          }
        ]
      })
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'metro':
        return <Train className="w-4 h-4" />
      case 'bus':
        return <Bus className="w-4 h-4" />
      case 'walk':
        return <Navigation className="w-4 h-4" />
      default:
        return <Car className="w-4 h-4" />
    }
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'metro':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'bus':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'walk':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Route Navigation
            </h1>
            {selectedRoute && (
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-3 h-3" />
                <span>{selectedRoute.from} → {selectedRoute.to}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Simplified Map Visualization */}
            <motion.div 
              className="relative w-full h-full p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg viewBox="0 0 300 200" className="w-full h-full">
                {/* Route Path */}
                <motion.path
                  d="M 50 150 Q 150 50 250 100"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                
                {/* Start Point */}
                <motion.circle
                  cx="50"
                  cy="150"
                  r="8"
                  fill="#10b981"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                />
                
                {/* End Point */}
                <motion.circle
                  cx="250"
                  cy="100"
                  r="8"
                  fill="#ef4444"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 300 }}
                />
                
                {/* Transfer Point */}
                <motion.circle
                  cx="150"
                  cy="75"
                  r="6"
                  fill="#f59e0b"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.75, type: "spring", stiffness: 300 }}
                />
              </svg>

              {/* Location Labels */}
              <div className="absolute top-4 left-8 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow text-sm font-medium text-green-600 dark:text-green-400">
                Start
              </div>
              <div className="absolute bottom-8 right-8 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow text-sm font-medium text-red-600 dark:text-red-400">
                Destination
              </div>
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow text-sm font-medium text-orange-600 dark:text-orange-400">
                Transfer
              </div>
            </motion.div>
          </div>
        )}

        {/* Live Tracking Button */}
        <motion.button
          className="absolute bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Navigation className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Route Details */}
      <div className="px-4 py-6 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="Card animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Route Summary */}
            {selectedRoute && (
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    Route Summary
                  </h3>
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Active
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Clock className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                      {selectedRoute.duration}m
                    </div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  
                  <div>
                    <MapPin className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                      {selectedRoute.distance}km
                    </div>
                    <div className="text-xs text-gray-500">Distance</div>
                  </div>
                  
                  <div>
                    <Car className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                      ₹{selectedRoute.cost}
                    </div>
                    <div className="text-xs text-gray-500">Fare</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step-by-step Directions */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Step-by-step Directions
              </h3>

              {routeDetails?.steps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg mb-3 last:mb-0 ${getModeColor(step.mode)}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="mt-1">
                    {getModeIcon(step.mode)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      {step.instruction}
                    </div>
                    
                    <div className="text-sm opacity-75 flex items-center gap-3">
                      <span>{step.duration} min</span>
                      <span>•</span>
                      <span>{step.distance} km</span>
                    </div>
                    
                    {step.stops && (
                      <div className="text-xs opacity-75 mt-1">
                        Stops: {step.stops.join(' → ')}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Live Updates */}
            <motion.div 
              className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-800 dark:text-blue-300">
                  Live Updates
                </span>
              </div>
              
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Metro is running on time • No delays reported • Weather conditions normal
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}