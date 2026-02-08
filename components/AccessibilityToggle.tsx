'use client'

import { motion } from 'framer-motion'
import { Accessibility, Volume2, Eye, Navigation } from 'lucide-react'
import { useAppStore } from '@/stores/appStore'

export default function AccessibilityToggle() {
  const { accessibilityMode, toggleAccessibilityMode } = useAppStore()

  const features = [
    { icon: Eye, label: 'High Contrast' },
    { icon: Volume2, label: 'Voice Guide' },
    { icon: Navigation, label: 'Easy Routes' },
  ]

  return (
    <motion.div 
      className={`card cursor-pointer transition-all duration-300 ${
        accessibilityMode 
          ? 'ring-2 ring-accent-500 bg-accent-50 dark:bg-accent-900/20' 
          : ''
      }`}
      onClick={toggleAccessibilityMode}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div 
            className={`p-2 rounded-lg ${
              accessibilityMode 
                ? 'bg-accent-500 text-white' 
                : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
            }`}
            animate={{ 
              scale: accessibilityMode ? 1.1 : 1,
              rotate: accessibilityMode ? 5 : 0 
            }}
            transition={ { type: "spring", stiffness: 300 }}
          >
            <Accessibility className="w-4 h-4" />
          </motion.div>
          <h3 className={`font-medium ${
            accessibilityMode 
              ? 'text-accent-800 dark:text-accent-200' 
              : 'text-gray-800 dark:text-gray-200'
          }`}>
            Accessibility
          </h3>
        </div>
        
        {/* Toggle Switch */}
        <motion.div
          className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 ${
            accessibilityMode ? 'bg-accent-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="w-3 h-3 bg-white rounded-full shadow-sm"
            animate={{ x: accessibilityMode ? 16 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.div>
      </div>

      {/* Feature List */}
      <div className="space-y-2">
        {features.map((feature, index) => (
          <motion.div
            key={feature.label}
            className={`flex items-center gap-2 text-xs p-2 rounded-lg transition-all duration-200 ${
              accessibilityMode 
                ? 'bg-accent-100 dark:bg-accent-800/30 text-accent-700 dark:text-accent-300' 
                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              backgroundColor: accessibilityMode ? '#fef3c7' : undefined
            }}
            transition={{ delay: index * 0.1 }}
          >
            <feature.icon className="w-3 h-3" />
            <span>{feature.label}</span>
            {accessibilityMode && (
              <motion.div
                className="ml-auto w-2 h-2 bg-accent-500 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Status */}
      <div className="mt-3 text-xs text-center">
        <motion.span
          className={accessibilityMode ? 'text-accent-700 dark:text-accent-300 font-medium' : 'text-gray-500 dark:text-gray-400'}
          animate={{ 
            scale: accessibilityMode ? 1.05 : 1,
            fontWeight: accessibilityMode ? 600 : 400
          }}
        >
          {accessibilityMode ? 'Accessibility Active' : 'Tap to enable'}
        </motion.span>
      </div>

      {/* Large Touch Target Indicator */}
      {accessibilityMode && (
        <motion.div
          className="absolute inset-0 pointer-events-none border-2 border-accent-500 rounded-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
}