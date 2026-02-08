'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Leaf, 
  Award, 
  TrendingUp,
  Gift,
  Target,
  Calendar,
  BarChart3,
  Zap,
  TreePine,
  Recycle,
  Bike,
  Train,
  Car,
  Settings,
  Share2,
  Trophy,
  Star
} from 'lucide-react'
import { useAppStore } from '@/stores/appStore'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ElementType
  progress: number
  maxProgress: number
  reward: number
  completed: boolean
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface Reward {
  id: string
  title: string
  description: string
  cost: number
  type: 'discount' | 'voucher' | 'upgrade' | 'donation'
  icon: React.ElementType
  available: boolean
}

interface CarbonData {
  date: string
  saved: number
  mode: string
}

export default function KarmaPage() {
  const { commuteKarmaPoints, greenPoints, totalCarbonSaved } = useAppStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'rewards' | 'impact'>('overview')
  const [carbonData, setCarbonData] = useState<CarbonData[]>([])
  const [weeklyGoal, setWeeklyGoal] = useState(50) // kg CO2 saved per week
  const [currentStreak, setCurrentStreak] = useState(12) // days

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Public Transit Advocate',
      description: 'Use public transport 50 times',
      icon: Train,
      progress: 34,
      maxProgress: 50,
      reward: 100,
      completed: false,
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Carbon Ninja',
      description: 'Save 100kg CO2 in a month',
      icon: Leaf,
      progress: 100,
      maxProgress: 100,
      reward: 300,
      completed: true,
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Pool Pioneer',
      description: 'Pool with 25 different people',
      icon: Car,
      progress: 18,
      maxProgress: 25,
      reward: 200,
      completed: false,
      rarity: 'epic'
    },
    {
      id: '4',
      title: 'Green Warrior',
      description: 'Maintain 30-day eco-friendly streak',
      icon: TreePine,
      progress: 22,
      maxProgress: 30,
      reward: 500,
      completed: false,
      rarity: 'legendary'
    }
  ]

  const rewards: Reward[] = [
    {
      id: '1',
      title: '20% Off Next Ride',
      description: 'Valid for any transport mode',
      cost: 100,
      type: 'discount',
      icon: Zap,
      available: true
    },
    {
      id: '2',
      title: 'Coffee Voucher',
      description: 'Free coffee at partner cafes',
      cost: 150,
      type: 'voucher',
      icon: Gift,
      available: true
    },
    {
      id: '3',
      title: 'Premium Features',
      description: '1 week of premium access',
      cost: 300,
      type: 'upgrade',
      icon: Star,
      available: true
    },
    {
      id: '4',
      title: 'Plant a Tree',
      description: 'Donate to reforestation project',
      cost: 500,
      type: 'donation',
      icon: TreePine,
      available: commuteKarmaPoints >= 500
    }
  ]

  useEffect(() => {
    // Mock carbon data for the chart
    const mockData: CarbonData[] = [
      { date: '2024-02-01', saved: 2.3, mode: 'Metro' },
      { date: '2024-02-02', saved: 1.8, mode: 'Bus' },
      { date: '2024-02-03', saved: 3.2, mode: 'Pool' },
      { date: '2024-02-04', saved: 2.1, mode: 'Metro' },
      { date: '2024-02-05', saved: 2.8, mode: 'Pool' },
      { date: '2024-02-06', saved: 1.5, mode: 'Bus' },
      { date: '2024-02-07', saved: 3.5, mode: 'Pool' },
    ]
    setCarbonData(mockData)
  }, [])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600'
      case 'rare':
        return 'from-blue-400 to-blue-600'
      case 'epic':
        return 'from-purple-400 to-purple-600'
      case 'legendary':
        return 'from-yellow-400 to-orange-500'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const weeklyProgress = (carbonData.reduce((sum, day) => sum + day.saved, 0) / weeklyGoal) * 100

  return (
    <div className="min-h-screen pb-20 px-4 pt-8">
      {/* Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              Commute Karma
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your sustainable journey impact
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {currentStreak}
              </div>
              <div className="text-xs text-gray-500">day streak</div>
            </div>
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <Leaf className="w-6 h-6 mb-2" />
          <div className="text-2xl font-bold">{commuteKarmaPoints}</div>
          <div className="text-green-100 text-sm">Karma Points</div>
        </div>
        
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <Award className="w-6 h-6 mb-2" />
          <div className="text-2xl font-bold">{greenPoints}</div>
          <div className="text-blue-100 text-sm">Green Points</div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'achievements', label: 'Badges', icon: Trophy },
          { id: 'rewards', label: 'Rewards', icon: Gift },
          { id: 'impact', label: 'Impact', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="space-y-6"
          >
            {/* Weekly Goal Progress */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Weekly Carbon Goal
                </h3>
                <Target className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {carbonData.reduce((sum, day) => sum + day.saved, 0).toFixed(1)}kg saved
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {weeklyGoal}kg goal
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(weeklyProgress, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                
                <div className="text-center">
                  <span className={`text-lg font-bold ${
                    weeklyProgress >= 100 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {weeklyProgress.toFixed(1)}%
                  </span>
                  {weeklyProgress >= 100 && (
                    <div className="text-sm text-green-600 mt-1">🎉 Goal achieved!</div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="card">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                This Week's Impact
              </h3>
              
              <div className="space-y-3">
                {carbonData.slice(-5).map((day, index) => {
                  const date = new Date(day.date)
                  return (
                    <motion.div
                      key={day.date}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          {day.mode === 'Metro' && <Train className="w-4 h-4 text-green-600" />}
                          {day.mode === 'Bus' && <Car className="w-4 h-4 text-green-600" />}
                          {day.mode === 'Pool' && <Car className="w-4 h-4 text-green-600" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-gray-200">
                            {day.mode} Journey
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {date.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          -{day.saved}kg CO₂
                        </div>
                        <div className="text-xs text-gray-500">
                          +{Math.round(day.saved * 10)} pts
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="card">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Monthly Impact Summary
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <TreePine className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-blue-600">
                    {(totalCarbonSaved / 21.77).toFixed(1)}
                  </div>
                  <div className="text-sm text-blue-600">trees equivalent</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <Car className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-purple-600">
                    {(totalCarbonSaved * 4.4).toFixed(0)}
                  </div>
                  <div className="text-sm text-purple-600">km car avoided</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="space-y-4"
          >
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <motion.div
                  key={achievement.id}
                  className={`card relative overflow-hidden ${
                    achievement.completed ? 'ring-2 ring-green-500' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Rarity Background */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-bl-full opacity-20`} />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {achievement.description}
                        </p>
                        <div className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                          achievement.rarity === 'common' ? 'bg-gray-100 text-gray-700' :
                          achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                          achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {achievement.rarity}
                        </div>
                      </div>
                    </div>
                    
                    {achievement.completed && (
                      <div className="p-2 bg-green-100 text-green-600 rounded-full">
                        <Trophy className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Progress: {achievement.progress}/{achievement.maxProgress}
                      </span>
                      <span className="text-green-600 font-medium">
                        +{achievement.reward} pts
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="space-y-4"
          >
            <div className="card bg-gradient-to-r from-yellow-400 to-orange-500 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">Available Points</h3>
                  <p className="text-yellow-100 text-sm">Redeem your earned karma</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{commuteKarmaPoints}</div>
                  <div className="text-yellow-100 text-sm">karma points</div>
                </div>
              </div>
            </div>

            {rewards.map((reward, index) => {
              const Icon = reward.icon
              const canAfford = commuteKarmaPoints >= reward.cost
              
              return (
                <motion.div
                  key={reward.id}
                  className={`card ${
                    !canAfford ? 'opacity-60' : 'cursor-pointer hover:shadow-lg'
                  } transition-all duration-200`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={canAfford ? { scale: 1.02 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        reward.type === 'discount' ? 'bg-green-100 text-green-600' :
                        reward.type === 'voucher' ? 'bg-blue-100 text-blue-600' :
                        reward.type === 'upgrade' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                          {reward.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {reward.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {reward.cost}
                      </div>
                      <div className="text-sm text-gray-500">points</div>
                      
                      <motion.button
                        disabled={!canAfford}
                        className={`mt-2 px-4 py-1 rounded-full text-sm font-medium ${
                          canAfford
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        whileHover={canAfford ? { scale: 1.05 } : {}}
                        whileTap={canAfford ? { scale: 0.95 } : {}}
                      >
                        {canAfford ? 'Redeem' : 'Need More'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Impact Tab */}
        {activeTab === 'impact' && (
          <motion.div
            key="impact"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="space-y-6"
          >
            {/* Total Impact */}
            <div className="card bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <h3 className="font-bold text-lg mb-4">Your Lifetime Impact</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{totalCarbonSaved}kg</div>
                  <div className="text-green-100">CO₂ Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{Math.round(totalCarbonSaved * 4.4)}</div>
                  <div className="text-blue-100">km Car Avoided</div>
                </div>
              </div>
            </div>

            {/* Environmental Equivalents */}
            <div className="card">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Environmental Impact
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TreePine className="w-6 h-6 text-green-600" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      Trees Equivalent
                    </span>
                  </div>
                  <span className="font-bold text-green-600">
                    {(totalCarbonSaved / 21.77).toFixed(1)} trees
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Recycle className="w-6 h-6 text-blue-600" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      Plastic Bottles Saved
                    </span>
                  </div>
                  <span className="font-bold text-blue-600">
                    {Math.round(totalCarbonSaved * 45)} bottles
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-purple-600" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      Energy Conserved
                    </span>
                  </div>
                  <span className="font-bold text-purple-600">
                    {Math.round(totalCarbonSaved * 2.2)} kWh
                  </span>
                </div>
              </div>
            </div>

            {/* Share Impact */}
            <div className="card">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Share Your Impact
              </h3>
              
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Inspire others with your sustainable journey
                </p>
                
                <motion.button
                  className="btn-primary inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-4 h-4" />
                  Share on Social Media
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}