# OmniPath - Smart Urban Transit Ecosystem

> A comprehensive, privacy-first transportation platform that combines AI-driven intelligence with community-sourced data to revolutionize urban mobility.

## 🌟 Features

### Core Intelligence
- **Privacy-Preserving Crowd Analysis**: Real-time crowd detection with on-device processing
- **Context-Aware Adaptive Routing**: Weather-aware, accessibility-optimized route planning
- **Station Amenity Intelligence**: Community-validated station facility information
- **Unified Multimodal Payment**: One-tap QR payments across all transport modes

### Advanced Features
- **Auto Pooling System**: AI-powered commuter matching with automatic fare splitting
- **Real-time Event Response**: Multi-source alert system with consensus validation
- **Sustainable Intelligence**: Carbon tracking with gamified rewards system
- **Emergency SOS**: Silent and active emergency response with location tracking

### Technical Highlights
- **Offline-First Design**: Full functionality without internet connectivity
- **Progressive Web App**: Native-like experience across all devices
- **Real-time Updates**: WebSocket-powered live data synchronization
- **Privacy-First Architecture**: Zero personal data storage with encrypted communications

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd omnipath

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start the development server
npm run dev

# In another terminal, start the backend server
npm run server
```

### Development URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

## 🏗️ Architecture

### Frontend (Next.js PWA)
```
app/
├── layout.tsx          # Root layout with PWA config
├── page.tsx           # Home dashboard
├── providers.tsx      # State management setup
├── globals.css        # Global styles with design system
├── routes/           # Adaptive routing interface
├── stations/         # Station amenity map
├── payment/          # Unified payment system
├── pooling/          # Auto pooling interface
└── karma/            # Sustainability dashboard

components/
├── CrowdScore.tsx     # Real-time crowd intelligence
├── SmartRouting.tsx   # Route planning interface
├── WeatherAlerts.tsx  # Weather & alert system
├── QuickPayment.tsx   # Payment widget
├── AccessibilityToggle.tsx  # Accessibility controls
├── SOSButton.tsx      # Emergency response
└── Navigation.tsx     # Bottom navigation

stores/
├── appStore.ts        # Main application state
└── offlineStore.ts    # Offline data management
```

### Backend (Express + WebSocket)
```
server/
├── index.js           # Main server with WebSocket
└── routes/
    ├── routes.js      # Route planning & optimization
    ├── stations.js    # Station amenity management
    ├── crowd.js       # Crowd intelligence API
    ├── payments.js    # Payment processing
    ├── pooling.js     # Auto pooling system
    ├── weather.js     # Weather & alerts
    ├── karma.js       # Sustainability tracking
    └── sos.js         # Emergency services
```

## 📱 Core Components

### 1. Privacy-Preserving Crowd Intelligence
- **Technology**: On-device computer vision processing
- **Privacy**: No image storage, anonymous data aggregation
- **Real-time**: Live crowd percentage and seat probability
- **Accuracy**: Community validation with weighted scoring

### 2. Context-Aware Adaptive Routing
- **Multi-factor Optimization**: Traffic, weather, accessibility, sustainability
- **Real-time Adaptation**: Dynamic rerouting based on live conditions
- **Accessibility Integration**: Barrier-free route alternatives
- **Carbon Optimization**: Low-emission route suggestions

### 3. Station Amenity Intelligence
- **Community Sourced**: User-validated facility status
- **Voting System**: Upvote/downvote for facility working status
- **Real-time Updates**: Live amenity availability tracking
- **Accessibility Focus**: Detailed accessibility feature mapping

### 4. Unified Multimodal Payment
- **Single QR Interface**: One payment method for all transport
- **Automatic Deduction**: Seamless wallet-based transactions
- **Multi-transport Support**: Metro, bus, auto, bike sharing
- **Offline Capability**: Queue payments for later synchronization

### 5. Auto Pooling System
- **AI Matching**: Destination proximity and preference matching
- **Automatic Fare Split**: Real-time cost calculation
- **Safety Features**: Verified user profiles and rating system
- **Real-time Coordination**: Live chat and location sharing

### 6. Sustainable Intelligence
- **Carbon Tracking**: Detailed CO₂ impact measurement
- **Gamification**: Karma points and achievements system
- **Green Rewards**: Redeemable eco-friendly incentives
- **Impact Visualization**: Personal and community impact dashboards

## 🔧 API Endpoints

### Routes & Navigation
- `GET /api/routes` - Get available routes with filtering
- `POST /api/routes/optimize` - Real-time route optimization

### Station Management
- `GET /api/stations` - List stations with amenity status
- `POST /api/stations/:id/amenities/:amenity/vote` - Vote on facility status

### Crowd Intelligence
- `GET /api/crowd/:stationId` - Get crowd data for station
- `POST /api/crowd/report` - Report crowd conditions

### Payment System
- `POST /api/payments/generate-qr` - Generate payment QR code
- `POST /api/payments/process` - Process payment transaction
- `GET /api/payments/history/:userId` - Payment history

### Pooling System
- `GET /api/pooling/pools` - Available pools
- `POST /api/pooling/create` - Create new pool
- `POST /api/pooling/join` - Join existing pool

### Sustainability
- `GET /api/karma/:userId` - User karma and impact data
- `POST /api/karma/add-points` - Add karma points
- `POST /api/karma/:userId/redeem` - Redeem rewards

### Emergency Services
- `POST /api/sos/activate` - Activate emergency alert
- `POST /api/sos/deactivate` - Deactivate emergency
- `GET /api/sos/emergency-contacts` - Emergency contact list

### Weather & Alerts
- `GET /api/weather/current` - Current weather conditions
- `GET /api/weather/alerts` - Active weather alerts
- `POST /api/weather/report` - Report weather conditions

## 🔐 Privacy & Security

### Privacy-First Design
- **No Personal Data Storage**: Only anonymous, aggregated data
- **On-Device Processing**: Computer vision runs locally
- **Encrypted Communications**: End-to-end encryption for sensitive data
- **Minimal Data Collection**: Only essential information for functionality

### Security Measures
- **Helmet.js**: Security headers and protection
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Comprehensive request sanitization
- **CORS Configuration**: Restricted cross-origin access

## 📊 Offline Capabilities

### Offline-First Architecture
- **IndexedDB Storage**: Local data persistence via Dexie
- **Service Worker**: Background sync and caching
- **Queue Management**: Offline action queuing for later sync
- **Cached Routes**: Frequently used routes stored locally

### Automatic Synchronization
- **Background Sync**: Automatic data sync when online
- **Conflict Resolution**: Smart merging of offline/online data
- **Progressive Enhancement**: Graceful degradation without connectivity

## 🎨 Design System

### Theme Configuration
- **Primary Colors**: Deep blue (trust, reliability)
- **Secondary Colors**: Teal/Green (sustainability, mobility)
- **Accent Colors**: Warm orange/yellow (alerts, highlights)
- **Typography**: Inter font family with accessibility focus

### Accessibility Features
- **High Contrast Mode**: Enhanced visibility options
- **Large Touch Targets**: Finger-friendly interface elements
- **Screen Reader Support**: Comprehensive ARIA labeling
- **Keyboard Navigation**: Full keyboard accessibility
- **Voice Guidance**: Audio navigation assistance

## 🚀 Deployment

### Production Build
```bash
# Build the frontend
npm run build

# Start production server
npm start

# Start backend server
npm run server
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
- Database connections
- API keys for external services
- Security secrets
- Payment gateway credentials

### PWA Installation
The app can be installed as a Progressive Web App on:
- Mobile devices (iOS Safari, Android Chrome)
- Desktop browsers (Chrome, Edge, Firefox)
- Provides native-like experience with offline functionality

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Workflow

### Recommended Development Setup
1. **IDE**: VS Code with recommended extensions
2. **Browser**: Chrome with React Developer Tools
3. **API Testing**: Postman or Thunder Client
4. **Version Control**: Git with conventional commits

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety and better development experience
- **Prettier**: Consistent code formatting
- **Testing**: Component and integration testing

## 🌍 Sustainability Impact

### Carbon Footprint Reduction
- **Route Optimization**: AI-powered low-emission path finding
- **Mode Shift Encouragement**: Incentivizing public transport usage
- **Pooling Benefits**: Reduced vehicle usage through shared rides
- **Real-time Tracking**: Comprehensive carbon impact measurement

### Community Benefits
- **Reduced Congestion**: Optimized transport usage patterns
- **Improved Accessibility**: Barrier-free navigation for all users
- **Cost Savings**: Pooling and optimization reduce travel costs
- **Emergency Safety**: Comprehensive emergency response system

## 📞 Support

- **Documentation**: In-app help and guides
- **Community**: User forums and support channels
- **Emergency**: 24/7 emergency services integration
- **Feedback**: In-app feedback and suggestion system

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**OmniPath** - Revolutionizing urban mobility through intelligent, sustainable, and inclusive transportation solutions.