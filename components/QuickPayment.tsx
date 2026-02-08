'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, QrCode, Wallet, Check } from 'lucide-react'
import { useAppStore } from '@/stores/appStore'
import { useRouter } from 'next/navigation'

export default function QuickPayment() {
  const router = useRouter()
  const { walletBalance, lastPayment } = useAppStore()
  const [showBalance, setShowBalance] = useState(false)

  const handlePaymentAccess = () => {
    router.push('/payment')
  }

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 500) return 'text-green-600 dark:text-green-400'
    if (balance > 200) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <motion.div 
      className="card cursor-pointer"
      onClick={handlePaymentAccess}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
            <CreditCard className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200">Payment</h3>
        </div>
        <QrCode className="w-4 h-4 text-gray-400" />
      </div>

      {/* Balance Display */}
      <div className="space-y-2">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            setShowBalance(!showBalance)
          }}
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Wallet Balance
          </span>
          <motion.div
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <Wallet className="w-3 h-3 text-gray-500" />
          </motion.div>
        </div>
        
        <motion.div
          className={`text-lg font-bold ${getBalanceColor(walletBalance)}`}
          animate={{ opacity: showBalance ? 1 : 0.7 }}
        >
          {showBalance ? formatBalance(walletBalance) : '••••••'}
        </motion.div>
      </div>

      {/* Last Payment */}
      {lastPayment && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Last payment</span>
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Check className="w-3 h-3" />
              {formatBalance(lastPayment.amount)}
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(lastPayment.timestamp).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* Quick Action Hint */}
      <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
        Tap for QR payment
      </div>

      {/* Payment Status Indicators */}
      <div className="mt-2 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
      </div>
    </motion.div>
  )
}