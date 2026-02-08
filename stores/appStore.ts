import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Route {
  id: string
  from: string
  to: string
  duration: number
  distance: number
  congestionScore: number
  weatherRisk: number
  accessibilityFriendly: boolean
  carbonFootprint: number
  cost: number
}

export interface CrowdData {
  stationId: string
  crowdPercentage: number
  seatProbability: number
  timestamp: number
}

export interface WeatherAlert {
  id: string
  type: 'rain' | 'flood' | 'extreme_heat' | 'storm'
  severity: 'low' | 'medium' | 'high'
  message: string
  affectedAreas: string[]
  timestamp: number
}

export interface AppState {
  // Connection state
  isOnline: boolean
  
  // User preferences
  accessibilityMode: boolean
  darkMode: boolean
  
  // Current location and route
  currentLocation: { lat: number; lng: number } | null
  selectedRoute: Route | null
  
  // Real-time data
  crowdData: CrowdData[]
  weatherAlerts: WeatherAlert[]
  
  // Sustainability tracking
  commuteKarmaPoints: number
  greenPoints: number
  totalCarbonSaved: number
  
  // Payment state
  walletBalance: number
  lastPayment: { amount: number; timestamp: number } | null
  
  // Emergency state
  sosActive: boolean
  
  // Actions
  setOnlineStatus: (online: boolean) => void
  toggleAccessibilityMode: () => void
  toggleDarkMode: () => void
  setCurrentLocation: (location: { lat: number; lng: number }) => void
  setSelectedRoute: (route: Route | null) => void
  updateCrowdData: (data: CrowdData[]) => void
  addWeatherAlert: (alert: WeatherAlert) => void
  clearWeatherAlerts: () => void
  updateKarmaPoints: (points: number) => void
  updateGreenPoints: (points: number) => void
  updateWalletBalance: (balance: number) => void
  setLastPayment: (payment: { amount: number; timestamp: number }) => void
  activateSOS: () => void
  deactivateSOS: () => void
  initializeApp: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      // Start as offline on the server and during initial render to avoid
      // hydration mismatches. The real online status is detected in
      // `initializeApp` which runs on the client.
      isOnline: false,
      accessibilityMode: false,
      darkMode: false,
      currentLocation: null,
      selectedRoute: null,
      crowdData: [],
      weatherAlerts: [],
      commuteKarmaPoints: 0,
      greenPoints: 0,
      totalCarbonSaved: 0,
      walletBalance: 1000, // Initial balance in local currency
      lastPayment: null,
      sosActive: false,

      // Actions
      setOnlineStatus: (online) => set({ isOnline: online }),
      
      toggleAccessibilityMode: () => set((state) => ({ 
        accessibilityMode: !state.accessibilityMode 
      })),
      
      toggleDarkMode: () => set((state) => ({ 
        darkMode: !state.darkMode 
      })),
      
      setCurrentLocation: (location) => set({ currentLocation: location }),
      
      setSelectedRoute: (route) => set({ selectedRoute: route }),
      
      updateCrowdData: (data) => set({ crowdData: data }),
      
      addWeatherAlert: (alert) => set((state) => ({
        weatherAlerts: [...state.weatherAlerts, alert]
      })),
      
      clearWeatherAlerts: () => set({ weatherAlerts: [] }),
      
      updateKarmaPoints: (points) => set((state) => ({
        commuteKarmaPoints: state.commuteKarmaPoints + points
      })),
      
      updateGreenPoints: (points) => set((state) => ({
        greenPoints: state.greenPoints + points
      })),
      
      updateWalletBalance: (balance) => set({ walletBalance: balance }),
      
      setLastPayment: (payment) => set({ lastPayment: payment }),
      
      activateSOS: () => set({ sosActive: true }),
      
      deactivateSOS: () => set({ sosActive: false }),
      
      initializeApp: () => {
        // Initialize geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              get().setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              })
            },
            (error) => {
              console.log('Geolocation error:', error)
            }
          )
        }

        // Detect current online status and listen for changes
        get().setOnlineStatus(typeof navigator !== 'undefined' ? navigator.onLine : false)

        const handleOnline = () => get().setOnlineStatus(true)
        const handleOffline = () => get().setOnlineStatus(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
          window.removeEventListener('online', handleOnline)
          window.removeEventListener('offline', handleOffline)
        }
      },
    }),
    {
      name: 'omnipath-app-store',
      partialize: (state) => ({
        accessibilityMode: state.accessibilityMode,
        darkMode: state.darkMode,
        commuteKarmaPoints: state.commuteKarmaPoints,
        greenPoints: state.greenPoints,
        totalCarbonSaved: state.totalCarbonSaved,
        walletBalance: state.walletBalance,
      }),
    }
  )
)