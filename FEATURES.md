# NFT Case Auction Marketplace - Monad 10K TPS Demo

A real-time NFT case auction platform showcasing Monad's 10,000 TPS capability through engaging tap-to-bid mechanics.

## Key Features

### 🎯 Core Auction Mechanics
- **Create Case Auctions**: Select NFTs, set minimum price, choose duration (5m/15m/30m/1h)
- **Live Bidding**: +1 MON per tap with instant price updates
- **Auto-Bid Mode**: Automated bidding for hands-free participation
- **Real-time Simulation**: AI competitors create realistic auction dynamics
- **Lead/Outbid Alerts**: Visual and haptic feedback for status changes

### 🎨 Visual Design
- Dark theme with Monad purple gradient accents
- Glassmorphism cards with backdrop blur
- Rarity-based color coding (Common → Legendary)
- Responsive layout (mobile, tablet, desktop)
- Smooth Framer Motion animations

### ⚡ Live Auction Experience
- **Price Ticker**: Animated price updates with pop effects
- **+1 Rain**: Floating chips during high bid activity
- **Lead Glow**: Pulsing outline when you're leading
- **Outbid Banner**: Falling alert from top when outbid
- **Countdown Timer**: Urgent animation in last 10 seconds
- **Bid Feed**: Real-time scrolling bid stream
- **Top Bidders**: Live leaderboard with your position

### 🎁 Reveal Scene (Winners)
- Sequential NFT card flip animations
- Rarity-based glow effects
- Confetti celebration
- Profit/loss calculation display
- EV comparison (exact vs rarity baseline)

### 📊 Features by Page

#### Home Page
- Hero section with Monad branding
- Featured live auctions grid
- Bid velocity indicators (🔥)
- Time remaining badges
- Quick EV and minimum price display

#### Auction Page
- Three-column layout (case info, live price, bid actions)
- Case contents gallery
- Competitor simulation engine
- Real-time bid velocity calculation
- Accessible ARIA live regions

#### Create Page
- NFT library browser with filters
- Multi-select interface
- Live EV calculation (exact + baseline)
- Rarity summary chips
- Form validation

#### Reveal Page
- Staggered card flip animations
- Per-item value callouts
- Total value vs paid comparison
- Profit/loss indicator
- Collection management

#### Profile Page
- Won/lost auction statistics
- Bid history
- Quick navigation to reveals
- Performance metrics

#### How It Works
- Auction flow explanation
- EV calculation methodology
- Monad 10K TPS education
- Responsible play notices

#### Settings
- Language toggle (TR/EN)
- Sound effects toggle
- Haptics control
- Reduced motion mode
- High contrast mode
- Demo reset function

### 🔧 Technical Features

#### State Management
- Zustand for global state
- LocalStorage persistence
- Demo reset capability
- Computed selectors for efficiency

#### Performance
- 60fps animation target
- Object pooling for +1 rain
- Efficient re-render optimization
- Lazy loading for images

#### Accessibility
- ARIA live regions for bid updates
- Keyboard navigation (Space/Enter for bid)
- Focus management
- Screen reader labels
- Reduced motion support

#### Simulation Engine
- Sigmoid curve for bid intensity
- Time-based competition increase
- Random burst mode
- Configurable bid velocity

### 📱 Mobile Features
- Touch-optimized tap targets
- Haptic feedback (Vibration API)
- Responsive grid layouts
- Mobile-friendly navigation
- Optimized animation density

### 🌐 Internationalization
- Turkish (default)
- English
- Easy toggle in header
- Comprehensive translation coverage

### 🎮 Demo-Only Features
- No real blockchain integration
- No wallet connection required
- Local-only data storage
- Instant reset capability
- Clear demo-only badges

## Data Model

### NFT Items
- 40+ mock NFTs across 5 rarity tiers
- Realistic MON value estimates
- High-quality Pexels images

### Seed Auctions
- 3 pre-configured live auctions
- Mixed rarity distributions
- Varied price points and durations

### Rarity Tiers
- **Common**: 2 MON baseline
- **Uncommon**: 6 MON baseline
- **Rare**: 20 MON baseline
- **Epic**: 200 MON baseline
- **Legendary**: 20,000 MON baseline

## Tech Stack
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Zustand (state management)
- React Router (routing)
- Lucide React (icons)

## Browser Support
- Modern browsers with ES6+ support
- Vibration API (optional, mobile)
- LocalStorage required
- BroadcastChannel (optional, for multi-tab sync)
