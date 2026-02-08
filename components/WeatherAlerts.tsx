'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Cloud, 
  CloudRain, 
  AlertTriangle, 
  Thermometer, 
  Wind,
  Droplets,
  Car
} from 'lucide-react'
import { useAppStore } from '@/stores/appStore'

export default function WeatherAlerts() {
  const { weatherAlerts, addWeatherAlert, clearWeatherAlerts, isOnline } = useAppStore()

  useEffect(() => {
    // Simulate real-time weather alerts
    if (isOnline) {
      const interval = setInterval(() => {
        // Randomly add weather alerts for demo
        if (Math.random() < 0.1) { // 10% chance every 5 seconds
          const alertTypes = [
            {
              type: 'rain' as const,
              severity: 'medium' as const,
              message: 'Moderate rainfall expected in next 30 minutes',
              affectedAreas: ['Central District', 'Tech Park'],
            },
            {
              type: 'flood' as const,
              severity: 'high' as const,
              message: 'Waterlogging reported on Old Highway',
              affectedAreas: ['Old Highway', 'Industrial Zone'],
            },
            {
              type: 'extreme_heat' as const,
              severity: 'medium' as const,
              message: 'High temperature advisory - Stay hydrated',
              affectedAreas: ['City Center'],
            },
          ]
          
          const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)]
          
          addWeatherAlert({
            id: `alert-${Date.now()}`,
            ...randomAlert,
            timestamp: Date.now(),
          })
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isOnline, addWeatherAlert])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'rain':
        return <CloudRain className="w-4 h-4" />
      case 'flood':
        return <Droplets className="w-4 h-4" />
      case 'extreme_heat':
        return <Thermometer className="w-4 h-4" />
      case 'storm':
        return <Wind className="w-4 h-4" />
      default:
        return <Cloud className="w-4 h-4" />
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-300',
          icon: 'text-red-600 dark:text-red-400',
        }
      case 'medium':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800',
          text: 'text-orange-800 dark:text-orange-300',
          icon: 'text-orange-600 dark:text-orange-400',
        }
      default:
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-300',
          icon: 'text-yellow-600 dark:text-yellow-400',
        }
    }
  }

  const currentTrafficScore = 67 // Mock traffic congestion score

  return (
    <motion.div 
      className="card"
      layout
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Live Alerts
        </h2>
        
        {weatherAlerts.length > 0 && (
          <button
            onClick={clearWeatherAlerts}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Traffic Congestion Score */}
      <motion.div 
        className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg border border-blue-200 dark:border-blue-800"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              City Traffic
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {currentTrafficScore}%
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              congested
            </div>
          </div>
        </div>
        
        <div className="mt-2 w-full h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${currentTrafficScore}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Weather Alerts */}
      <AnimatePresence mode="popLayout">
        {weatherAlerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6"
          >
            <Cloud className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isOnline ? 'No active alerts' : 'Offline - Limited alerts available'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {weatherAlerts.map((alert, index) => {
              const colors = getAlertColor(alert.severity)
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${colors.bg}`}
                  layout
                >
                  <div className="flex items-start gap-3">
                    <div className={colors.icon}>
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${colors.text}`}>
                        {alert.message}
                      </div>
                      
                      {alert.affectedAreas.length > 0 && (
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          Affected: {alert.affectedAreas.join(', ')}
                        </div>
                      )}
                      
                      <div className="mt-1 text-xs text-gray-500">
                        {Math.floor((Date.now() - alert.timestamp) / 60000)} min ago
                      </div>
                    </div>
                    
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                      alert.severity === 'high' 
                        ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' 
                        : alert.severity === 'medium'
                        ? 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200'
                        : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                    }`}>
                      {alert.severity}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Update Status */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        {isOnline ? 'Real-time updates active' : 'Offline mode - Limited data'}
      </div>
    </motion.div>
  )
}