const express = require('express')
const router = express.Router()

// Mock payment data storage
let payments = []
let wallets = new Map()

// GET /api/payments/methods - Get available payment methods
router.get('/methods', (req, res) => {
  const methods = [
    {
      id: 'wallet',
      name: 'OmniPath Wallet',
      type: 'wallet',
      enabled: true,
      balance: 1000
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      type: 'upi',
      enabled: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      type: 'card',
      enabled: true
    }
  ]
  
  res.json({
    success: true,
    methods
  })
})

// POST /api/payments/generate-qr - Generate payment QR code
router.post('/generate-qr', (req, res) => {
  const { amount, method, merchantId } = req.body
  
  if (!amount || !method) {
    return res.status(400).json({
      error: 'Missing required fields: amount, method'
    })
  }
  
  try {
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const qrData = {
      paymentId,
      merchant: merchantId || 'OmniPath Transit',
      amount: parseFloat(amount),
      currency: 'INR',
      method,
      timestamp: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
    }
    
    // Store payment for tracking
    payments.push({
      ...qrData,
      status: 'pending'
    })
    
    res.json({
      success: true,
      qrData: JSON.stringify(qrData),
      paymentId,
      expiresIn: 600 // seconds
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate QR code',
      message: error.message
    })
  }
})

// POST /api/payments/process - Process payment
router.post('/process', (req, res) => {
  const { paymentId, method, amount, userId } = req.body
  
  if (!paymentId || !method || !amount) {
    return res.status(400).json({
      error: 'Missing required fields'
    })
  }
  
  try {
    // Find pending payment
    const paymentIndex = payments.findIndex(p => p.paymentId === paymentId && p.status === 'pending')
    
    if (paymentIndex === -1) {
      return res.status(404).json({
        error: 'Payment not found or already processed'
      })
    }
    
    const payment = payments[paymentIndex]
    
    // Check if payment has expired
    if (Date.now() > payment.expiresAt) {
      payment.status = 'expired'
      return res.status(400).json({
        error: 'Payment has expired'
      })
    }
    
    // Mock payment processing
    const success = Math.random() > 0.1 // 90% success rate
    
    if (success) {
      payment.status = 'completed'
      payment.processedAt = Date.now()
      payment.transactionId = `txn_${Date.now()}`
      
      // Update wallet balance if using wallet
      if (method === 'wallet' && userId) {
        const currentBalance = wallets.get(userId) || 1000
        wallets.set(userId, currentBalance - amount)
      }
      
      res.json({
        success: true,
        payment,
        message: 'Payment processed successfully'
      })
    } else {
      payment.status = 'failed'
      payment.failureReason = 'Insufficient funds'
      
      res.status(400).json({
        error: 'Payment failed',
        reason: 'Insufficient funds'
      })
    }
  } catch (error) {
    res.status(500).json({
      error: 'Payment processing failed',
      message: error.message
    })
  }
})

// GET /api/payments/history/:userId - Get payment history
router.get('/history/:userId', (req, res) => {
  const { userId } = req.params
  
  // Mock payment history
  const history = [
    {
      id: '1',
      amount: 45,
      type: 'debit',
      description: 'Metro - Central to Tech Park',
      timestamp: Date.now() - 3600000,
      status: 'completed',
      method: 'QR Payment'
    },
    {
      id: '2', 
      amount: 500,
      type: 'credit',
      description: 'Wallet Top-up',
      timestamp: Date.now() - 7200000,
      status: 'completed',
      method: 'UPI'
    },
    {
      id: '3',
      amount: 28,
      type: 'debit', 
      description: 'Bus - Auto Pool Share',
      timestamp: Date.now() - 86400000,
      status: 'completed',
      method: 'QR Payment'
    }
  ]
  
  res.json({
    success: true,
    history
  })
})

// GET /api/payments/wallet/:userId - Get wallet balance
router.get('/wallet/:userId', (req, res) => {
  const { userId } = req.params
  const balance = wallets.get(userId) || 1000
  
  res.json({
    success: true,
    balance,
    currency: 'INR'
  })
})

module.exports = router