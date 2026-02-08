'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Navigation as NavigationIcon, 
  MapPin, 
  CreditCard, 
  Users,
  Leaf
} from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      name: 'Home',
      icon: Home,
      path: '/',
      color: 'text-primary-600',
    },
    {
      name: 'Routes',
      icon: NavigationIcon,
      path: '/routes',
      color: 'text-blue-600',
    },
    {
      name: 'Stations',
      icon: MapPin,
      path: '/stations',
      color: 'text-secondary-600',
    },
    {
      name: 'Payment',
      icon: CreditCard,
      path: '/payment',
      color: 'text-purple-600',
    },
    {
      name: 'Pooling',
      icon: Users,
      path: '/pooling',
      color: 'text-orange-600',
    },
    {
      name: 'Karma',
      icon: Leaf,
      path: '/karma',
      color: 'text-green-600',
    },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <motion.nav 
      className="floating-nav z-50 soft-fade"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 35, delay: 0.2 }}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon
          
          return (
            <motion.button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="relative flex flex-col items-center justify-center transition-all duration-200 h-14 w-16"
              whileTap={{ scale: 0.9 }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-secondary-400/30 rounded-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className={`relative z-10 ${isActive ? item.color : 'text-gray-500'} transition-colors duration-200`}>
                <Icon className="w-6 h-6" />
              </div>
              <span 
                className={`relative z-10 text-[10px] mt-1 font-semibold transition-colors duration-200 ${
                  isActive ? 'text-gray-800' : 'text-gray-500'
                }`}
              >
                {item.name}
              </span>
            </motion.button>
          )
        })}
      </div>
      <div className="h-safe-area-inset-bottom"></div>
    </motion.nav>
  )
}