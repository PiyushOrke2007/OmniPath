'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation, ArrowRight, MapPin, Clock, Accessibility } from 'lucide-react'
import { useAppStore } from '@/stores/appStore'
import { useRouter } from 'next/navigation'

export default function SmartRouting() {
  const router = useRouter()
  const { accessibilityMode, currentLocation } = useAppStore()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleRouteSearch = async () => {
    if (!from.trim() || !to.trim()) return

    setIsSearching(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSearching(false)
    
    // Navigate to routing page with search parameters
    router.push(`/routes?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
  }

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      setFrom('Current Location')
    } else {
      // Request location permission
      navigator.geolocation.getCurrentPosition(
        () => setFrom('Current Location'),
        () => alert('Location permission denied')
      )
    }
  }

  const popularRoutes = [
    { from: 'Central Station', to: 'Tech Park' },
    { from: 'Airport', to: 'City Center' },
    { from: 'University', to: 'Mall District' },
  ]

  return (
    <motion.div 
      className="card"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          Smart Routing
        </h2>
        
        {accessibilityMode && (
          <div className="flex items-center gap-1 px-2 py-1 bg-accent-100 text-accent-800 rounded-full text-xs font-medium">
            <Accessibility className="w-3 h-3" />
            Accessible
          </div>
        )}
      </div>

      {/* Route Input */}
      <div className="space-y-4">
        {/* From Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="From where?"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="input-field pr-10"
          />
          <button
            onClick={handleUseCurrentLocation}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>

        {/* Route Direction Indicator */}
        <div className="flex justify-center">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
            <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </div>
        </div>

        {/* To Input */}
        <div>
          <input
            type="text"
            placeholder="To where?"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Search Button */}
        <motion.button
          onClick={handleRouteSearch}
          disabled={!from.trim() || !to.trim() || isSearching}
          className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
            !from.trim() || !to.trim() || isSearching
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'btn-primary'
          }`}
          whileHover={{ scale: isSearching ? 1 : 1.02 }}
          whileTap={{ scale: isSearching ? 1 : 0.98 }}
        >
          {isSearching ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent border-r-transparent animate-spin rounded-full" />
              Finding Routes...
            </div>
          ) : (
            'Find Smart Routes'
          )}
        </motion.button>
      </div>

      {/* Popular Routes */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Popular Routes
        </h3>
        <div className="space-y-2">
          {popularRoutes.map((route, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setFrom(route.from)
                setTo(route.to)
              }}
              className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {route.from}
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-500" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {route.to}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  ~25 min
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}