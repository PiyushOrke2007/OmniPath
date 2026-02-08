'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Phone, MapPin, Clock } from 'lucide-react'
import { useAppStore } from '@/stores/appStore'
import toast from 'react-hot-toast'

export default function SOSButton() {
  const { sosActive, activateSOS, deactivateSOS, currentLocation } = useAppStore()
  const [pressCount, setPressCount] = useState(0)
  const [isPressed, setIsPressed] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    let countdownTimer: NodeJS.Timeout
    
    if (pressCount > 0) {
      timer = setTimeout(() => {
        setPressCount(0)
      }, 3000) // Reset after 3 seconds
    }

    if (pressCount >= 2 && !sosActive) {
      // Start 5-second countdown for SOS activation
      setCountdown(5)
      countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            activateSOS()
            toast.success('SOS Alert Activated')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      clearTimeout(timer)
      clearInterval(countdownTimer)
    }
  }, [pressCount, sosActive, activateSOS])

  const handleSOSPress = () => {
    if (sosActive) {
      // Deactivate SOS
      deactivateSOS()
      toast.success('SOS Alert Deactivated')
      setPressCount(0)
      setCountdown(0)
      return
    }

    // Double-tap detection
    setPressCount(prev => prev + 1)
    setIsPressed(true)
    
    setTimeout(() => setIsPressed(false), 150)

    if (pressCount === 0) {
      toast('Tap again quickly to activate SOS', {
        duration: 2000,
        icon: '⚠️',
      })
    }
  }

  const emergencyContacts = [
    { name: 'Emergency Services', number: '112' },
    { name: 'Women Helpline', number: '1091' },
    { name: 'Railway Security', number: '182' },
  ]

  return (
    <div className="space-y-4">
      {/* SOS Button */}
      <motion.button
        onTouchStart={handleSOSPress}
        onClick={handleSOSPress}
        className={`relative w-20 h-20 rounded-full font-bold text-white shadow-lg transition-all duration-200 ${
          sosActive 
            ? 'bg-green-600 hover:bg-green-700' 
            : countdown > 0
            ? 'bg-orange-500 hover:bg-orange-600'
            : 'bg-red-600 hover:bg-red-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          scale: isPressed ? 0.9 : 1,
          boxShadow: sosActive 
            ? '0 0 30px rgba(34, 197, 94, 0.5)' 
            : countdown > 0
            ? '0 0 30px rgba(249, 115, 22, 0.5)'
            : '0 0 20px rgba(220, 38, 38, 0.3)'
        }}
      >
        {/* Pulsing animation for active SOS */}
        {(sosActive || countdown > 0) && (
          <motion.div
            className={`absolute inset-0 rounded-full ${
              sosActive ? 'bg-green-400' : 'bg-orange-400'
            }`}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 0, 0.7] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        )}
        
        <div className="relative z-10 flex flex-col items-center justify-center">
          <AlertTriangle className="w-6 h-6 mb-1" />
          {countdown > 0 ? (
            <span className="text-lg font-bold">{countdown}</span>
          ) : sosActive ? (
            <span className="text-xs">ACTIVE</span>
          ) : (
            <span className="text-xs">SOS</span>
          )}
        </div>
      </motion.button>

      {/* Status and Instructions */}
      <div className="text-center">
        {sosActive ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="text-green-600 dark:text-green-400 font-medium text-sm">
              🚨 SOS Alert Active
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Emergency services notified<br />
              {currentLocation && 'Location shared automatically'}
            </div>
          </motion.div>
        ) : countdown > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-orange-600 dark:text-orange-400 font-medium text-sm"
          >
            Activating SOS in {countdown}s...
          </motion.div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {pressCount === 1 ? (
                <span className="text-orange-600 font-medium">
                  Tap again quickly!
                </span>
              ) : (
                'Double-tap for emergency'
              )}
            </div>
            <div className="text-xs text-gray-500">
              Silent activation • GPS tracking
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contacts */}
      {sosActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-red-800 dark:text-red-300 text-sm">
              Emergency Contacts
            </h3>
            <Phone className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          
          {emergencyContacts.map((contact, index) => (
            <motion.a
              key={contact.number}
              href={`tel:${contact.number}`}
              className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {contact.name}
              </span>
              <span className="text-sm text-red-600 dark:text-red-400 font-mono">
                {contact.number}
              </span>
            </motion.a>
          ))}

          {/* Location Status */}
          {currentLocation && (
            <div className="pt-2 border-t border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                <MapPin className="w-3 h-3" />
                <span>Location: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 mt-1">
                <Clock className="w-3 h-3" />
                <span>Activated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}