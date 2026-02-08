'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  QrCode, 
  Wallet, 
  CreditCard, 
  Smartphone,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
  Minus,
  History,
  Settings
} from 'lucide-react'
import { useAppStore } from '@/stores/appStore'
import QRCodeGenerator from 'qrcode'

interface PaymentMethod {
  id: string
  name: string
  type: 'upi' | 'card' | 'wallet'
  icon: React.ElementType
  balance?: number
  lastUsed: number
}

interface Transaction {
  id: string
  amount: number
  type: 'debit' | 'credit'
  description: string
  timestamp: number
  status: 'completed' | 'pending' | 'failed'
  mode: string
}

export default function PaymentPage() {
  const { walletBalance, updateWalletBalance, setLastPayment } = useAppStore()
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<string>('wallet')
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'generating' | 'active' | 'completed'>('idle')

  const predefinedAmounts = [50, 100, 200, 500]

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'wallet',
      name: 'OmniPath Wallet',
      type: 'wallet',
      icon: Wallet,
      balance: walletBalance,
      lastUsed: Date.now() - 3600000
    },
    {
      id: 'upi',
      name: 'UPI',
      type: 'upi',
      icon: Smartphone,
      lastUsed: Date.now() - 7200000
    },
    {
      id: 'card',
      name: 'Debit/Credit Card',
      type: 'card',
      icon: CreditCard,
      lastUsed: Date.now() - 86400000
    }
  ]

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      amount: 45,
      type: 'debit',
      description: 'Metro - Central to Tech Park',
      timestamp: Date.now() - 3600000,
      status: 'completed',
      mode: 'QR Payment'
    },
    {
      id: '2',
      amount: 500,
      type: 'credit',
      description: 'Wallet Top-up',
      timestamp: Date.now() - 7200000,
      status: 'completed',
      mode: 'UPI'
    },
    {
      id: '3',
      amount: 28,
      type: 'debit',
      description: 'Bus - Auto Pool Share',
      timestamp: Date.now() - 86400000,
      status: 'completed',
      mode: 'QR Payment'
    }
  ]

  useEffect(() => {
    // Generate QR code when amount is selected
    if (selectedAmount || customAmount) {
      generateQRCode()
    }
  }, [selectedAmount, customAmount, selectedMethod])

  const generateQRCode = async () => {
    setPaymentStatus('generating')
    
    const amount = selectedAmount || parseInt(customAmount)
    const paymentData = {
      merchant: 'OmniPath Transit',
      amount: amount,
      currency: 'INR',
      method: selectedMethod,
      timestamp: Date.now(),
      id: `pay_${Date.now()}`
    }

    try {
      const qrString = JSON.stringify(paymentData)
      const dataUrl = await QRCodeGenerator.toDataURL(qrString, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        width: 256,
        color: {
          dark: '#1e40af',
          light: '#ffffff'
        }
      })
      
      setQrDataUrl(dataUrl)
      setPaymentStatus('active')
      
      // Simulate payment completion after 10 seconds
      setTimeout(() => {
        handlePaymentComplete(amount)
      }, 10000)
    } catch (error) {
      console.error('QR generation failed:', error)
      setPaymentStatus('idle')
    }
  }

  const handlePaymentComplete = (amount: number) => {
    updateWalletBalance(walletBalance - amount)
    setLastPayment({ amount, timestamp: Date.now() })
    setPaymentStatus('completed')
    
    setTimeout(() => {
      setPaymentStatus('idle')
      setSelectedAmount(null)
      setCustomAmount('')
      setQrDataUrl('')
    }, 3000)
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
    }
  }

  return (
    <div className="min-h-screen pb-20 px-4 pt-8">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Quick Payment
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Unified transit payment system
          </p>
        </div>

        <button
          onClick={() => setShowTransactionHistory(!showTransactionHistory)}
          className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {showTransactionHistory ? (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Recent Transactions
              </h2>
              <button
                onClick={() => setShowTransactionHistory(false)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Back to Payment
              </button>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'credit' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        <ArrowRight className={`w-4 h-4 ${
                          transaction.type === 'credit' ? 'rotate-180' : ''
                        }`} />
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.mode} • {new Date(transaction.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="space-y-6"
          >
            {/* Wallet Balance */}
            <motion.div 
              className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-primary-100 text-sm mb-1">Available Balance</div>
                  <div className="text-2xl font-bold">{formatCurrency(walletBalance)}</div>
                </div>
                <Wallet className="w-8 h-8 text-primary-200" />
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Payment Method
              </h3>
              <div className="space-y-2">
                {paymentMethods.map(method => {
                  const Icon = method.icon
                  return (
                    <motion.button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedMethod === method.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedMethod === method.id
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          
                          <div className="text-left">
                            <div className="font-medium text-gray-800 dark:text-gray-200">
                              {method.name}
                            </div>
                            {method.balance !== undefined && (
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Balance: {formatCurrency(method.balance)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                          selectedMethod === method.id
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedMethod === method.id && (
                            <motion.div 
                              className="w-full h-full rounded-full bg-white scale-50"
                              initial={{ scale: 0 }}
                              animate={{ scale: 0.5 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Amount Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Select Amount
              </h3>
              
              {/* Predefined Amounts */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {predefinedAmounts.map(amount => (
                  <motion.button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedAmount === amount
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {formatCurrency(amount)}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="input-field"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  ₹
                </div>
              </div>
            </motion.div>

            {/* QR Code Display */}
            <AnimatePresence>
              {(selectedAmount || customAmount) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="card text-center"
                >
                  {paymentStatus === 'generating' && (
                    <div className="py-8">
                      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Generating QR Code...
                      </div>
                    </div>
                  )}

                  {paymentStatus === 'active' && qrDataUrl && (
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Scan to Pay {formatCurrency(selectedAmount || parseInt(customAmount))}
                      </h4>
                      
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-4"
                      >
                        <img src={qrDataUrl} alt="Payment QR Code" className="w-48 h-48" />
                      </motion.div>
                      
                      <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Waiting for payment...</span>
                      </div>
                    </div>
                  )}

                  {paymentStatus === 'completed' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-8"
                    >
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-green-600 mb-2">
                        Payment Successful!
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your payment has been processed
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}