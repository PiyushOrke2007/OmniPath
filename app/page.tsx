'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import CrowdScore from '@/components/CrowdScore'
import SmartRouting from '@/components/SmartRouting'
import WeatherAlerts from '@/components/WeatherAlerts'
import QuickPayment from '@/components/QuickPayment'
import AccessibilityToggle from '@/components/AccessibilityToggle'
import SOSButton from '@/components/SOSButton'
import { useAppStore } from '@/stores/appStore'

export default function HomePage() {
  const { initializeApp, isOnline } = useAppStore()

  useEffect(() => {
    initializeApp()
  }, [initializeApp])

  return (
    <main className="min-h-screen pb-28 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
        className="max-w-2xl mx-auto"
      >
        {/* Welcome Section */}
        <div className="text-center mb-10 pt-4">
          <motion.h1 
            className="text-4xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          >
            Namaste, Priya
          </motion.h1>
          <motion.p 
            className="text-gray-500 text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Your Mumbai transit dashboard.
          </motion.p>
          
          <motion.div 
            className={`inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isOnline 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {isOnline ? 'Online' : 'Offline Mode'}
          </motion.div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div className="md:col-span-2" variants={itemVariants}><SmartRouting /></motion.div>
          <motion.div variants={itemVariants}><CrowdScore /></motion.div>
          <motion.div variants={itemVariants}><QuickPayment /></motion.div>
          <motion.div variants={itemVariants}><WeatherAlerts /></motion.div>
          <motion.div variants={itemVariants}><AccessibilityToggle /></motion.div>
          <motion.div className="md:col-span-2" variants={itemVariants}><SOSButton /></motion.div>
        </div>
      </motion.div>
    </main>
  )
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};