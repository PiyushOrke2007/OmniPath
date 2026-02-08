import React from 'react'
import { create } from 'zustand'
import Dexie, { Table } from 'dexie'

// Database schema
export interface OfflineRoute {
  id?: number
  from: string
  to: string
  routeData: any
  timestamp: number
}

export interface OfflineStation {
  id?: number
  stationId: string
  amenities: {
    atm: boolean
    restroom: boolean
    food: boolean
    water: boolean
  }
  votes: {
    upvotes: number
    downvotes: number
  }
  timestamp: number
}

export interface OfflinePayment {
  id?: number
  amount: number
  method: string
  timestamp: number
  synced: boolean
}

export interface OfflineCrowdData {
  id?: number
  stationId: string
  crowdPercentage: number
  timestamp: number
}

// Dexie database class
class OmniPathDB extends Dexie {
  routes!: Table<OfflineRoute>
  stations!: Table<OfflineStation>
  payments!: Table<OfflinePayment>
  crowdData!: Table<OfflineCrowdData>

  constructor() {
    super('OmniPathDB')
    this.version(1).stores({
      routes: '++id, from, to, timestamp',
      stations: '++id, stationId, timestamp',
      payments: '++id, timestamp, synced',
      crowdData: '++id, stationId, timestamp',
    })
  }
}

const db = new OmniPathDB()

export interface OfflineState {
  isOfflineReady: boolean
  pendingSyncItems: number
  lastSyncTime: number | null
  
  // Offline data management
  cacheRoute: (route: Omit<OfflineRoute, 'id'>) => Promise<void>
  getCachedRoutes: (from: string, to: string) => Promise<OfflineRoute[]>
  cacheStationData: (station: Omit<OfflineStation, 'id'>) => Promise<void>
  getCachedStationData: (stationId: string) => Promise<OfflineStation | undefined>
  cacheCrowdData: (data: Omit<OfflineCrowdData, 'id'>) => Promise<void>
  getCachedCrowdData: (stationId: string) => Promise<OfflineCrowdData[]>
  addOfflinePayment: (payment: Omit<OfflinePayment, 'id'>) => Promise<void>
  syncPendingData: () => Promise<void>
  clearOldCache: () => Promise<void>
  initializeOfflineStore: () => Promise<void>
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  isOfflineReady: false,
  pendingSyncItems: 0,
  lastSyncTime: null,

  cacheRoute: async (route) => {
    try {
      await db.routes.add(route)
      console.log('Route cached successfully')
    } catch (error) {
      console.error('Failed to cache route:', error)
    }
  },

  getCachedRoutes: async (from, to) => {
    try {
      return await db.routes
        .where('from').equals(from)
        .and(route => route.to === to)
        .reverse()
        .limit(5)
        .toArray()
    } catch (error) {
      console.error('Failed to get cached routes:', error)
      return []
    }
  },

  cacheStationData: async (station) => {
    try {
      // Check if station already exists
      const existing = await db.stations.where('stationId').equals(station.stationId).first()
      if (existing) {
        await db.stations.update(existing.id!, station)
      } else {
        await db.stations.add(station)
      }
      console.log('Station data cached successfully')
    } catch (error) {
      console.error('Failed to cache station data:', error)
    }
  },

  getCachedStationData: async (stationId) => {
    try {
      return await db.stations.where('stationId').equals(stationId).first()
    } catch (error) {
      console.error('Failed to get cached station data:', error)
      return undefined
    }
  },

  cacheCrowdData: async (data) => {
    try {
      await db.crowdData.add(data)
      // Keep only last 50 entries per station
      const allData = await db.crowdData.where('stationId').equals(data.stationId).reverse().toArray()
      if (allData.length > 50) {
        const toDelete = allData.slice(50).map(item => item.id!)
        await db.crowdData.bulkDelete(toDelete)
      }
    } catch (error) {
      console.error('Failed to cache crowd data:', error)
    }
  },

  getCachedCrowdData: async (stationId) => {
    try {
      return await db.crowdData
        .where('stationId').equals(stationId)
        .reverse()
        .limit(10)
        .toArray()
    } catch (error) {
      console.error('Failed to get cached crowd data:', error)
      return []
    }
  },

  addOfflinePayment: async (payment) => {
    try {
      await db.payments.add(payment)
      const pending = await db.payments.where('synced').equals(0).count()
      set({ pendingSyncItems: pending })
      console.log('Offline payment recorded')
    } catch (error) {
      console.error('Failed to record offline payment:', error)
    }
  },

  syncPendingData: async () => {
    try {
      const pendingPayments = await db.payments.where('synced').equals(0).toArray()
      
      // TODO: Implement actual sync with backend
      for (const payment of pendingPayments) {
        // Simulate sync
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (payment.id) {
          await db.payments.update(payment.id, { synced: true })
        }
      }
      
      set({ 
        pendingSyncItems: 0,
        lastSyncTime: Date.now() 
      })
      
      console.log('Sync completed successfully')
    } catch (error) {
      console.error('Sync failed:', error)
    }
  },

  clearOldCache: async () => {
    try {
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
      
      // Clear old routes (keep last 24 hours)
      await db.routes.where('timestamp').below(oneDayAgo).delete()
      
      // Clear old crowd data (keep last 24 hours)
      await db.crowdData.where('timestamp').below(oneDayAgo).delete()
      
      console.log('Old cache cleared')
    } catch (error) {
      console.error('Failed to clear old cache:', error)
    }
  },

  initializeOfflineStore: async () => {
    try {
      await db.open()
      await get().clearOldCache()
      
      const pending = await db.payments.where('synced').equals(0).count()
      set({ 
        isOfflineReady: true,
        pendingSyncItems: pending 
      })
      
      console.log('Offline store initialized')
    } catch (error) {
      console.error('Failed to initialize offline store:', error)
    }
  },
}))

// Provider component
export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const { initializeOfflineStore } = useOfflineStore()

  React.useEffect(() => {
    initializeOfflineStore()
  }, [initializeOfflineStore])

  return <>{children}</>
}
