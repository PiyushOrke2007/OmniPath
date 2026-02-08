'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingDown, TrendingUp } from 'lucide-react'
import { useAppStore } from '@/stores/appStore'

export default function CrowdScore() {
  const { crowdData, currentLocation, isOnline } = useAppStore()
  const [currentCrowdScore, setCurrentCrowdScore] = useState(45)
  const [seatProbability, setSeatProbability] = useState(72)
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable')

  useEffect(() => {
    // Simulate crowd score updates
    const interval = setInterval(() => {
      if (isOnline) {
        const newScore = Math.max(10, Math.min(95, currentCrowdScore + (Math.random() - 0.5) * 10))
        const newSeatProb = Math.max(5, Math.min(95, 100 - newScore + (Math.random() * 20)))
        
        setTrend(newScore > currentCrowdScore ? 'up' : newScore < currentCrowdScore ? 'down' : 'stable')
        setCurrentCrowdScore(Math.round(newScore))
        setSeatProbability(Math.round(newSeatProb))
      }
    }, 10000) // Update every 10 seconds when online

    return () => clearInterval(interval)
  }, [currentCrowdScore, isOnline])

  const getCrowdColor = (score: number) => {
    if (score < 30) return 'text-green-600'
    if (score < 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCrowdBgColor = (score: number) => {
    if (score < 30) return 'from-green-500 to-green-600'
    if (score < 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-red-600'
  }

  return (
    <motion.div 
      className="card"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Live Crowd Score
        </h2>
        
        {trend !== 'stable' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1"
          >
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-500" />
            )}
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {/* Crowd Score Circle */}
        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#crowdGradient)"
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 40 * (1 - currentCrowdScore / 100) 
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="crowd-score-ring"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="crowdGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={getCrowdColor(currentCrowdScore)} />
                <stop offset="100%" className={getCrowdColor(currentCrowdScore)} />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Score text in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div 
                key={currentCrowdScore}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-2xl font-bold ${getCrowdColor(currentCrowdScore)}`}
              >
                {currentCrowdScore}%
              </motion.div>
              <div className="text-xs text-gray-500 dark:text-gray-400">crowded</div>
            </div>
          </div>
        </div>

        {/* Seat Probability */}
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Seat Probability
          </div>
          <motion.div 
            key={seatProbability}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-secondary-600 dark:text-secondary-400"
          >
            {seatProbability}%
          </motion.div>
          
          {/* Visual indicator */}
          <div className="mt-2 w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-secondary-500 to-secondary-600"
              initial={{ width: 0 }}
              animate={{ width: `${seatProbability}%` }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
          🔒 Privacy-first: No images stored, on-device analysis only
        </p>
      </div>

      {/* Last updated */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        {isOnline ? 'Live updates' : 'Offline mode - Using cached data'}
      </div>
    </motion.div>
  )
}