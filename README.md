# 🏆 Sportify - Athletic Talent Discovery Platform

**अपनी प्रतिभा खोलें** - India's premier AI-powered platform for discovering and nurturing grassroots athletic talent through video screening and SAI center connectivity.

## 🎯 Project Overview

Sportify is a comprehensive athletic talent discovery ecosystem that leverages cutting-edge AI and machine learning to identify and develop sports talent across India. The platform connects young athletes with SAI (Sports Authority of India) centers through advanced pose analysis, performance tracking, and competitive gamification.

### 🌟 Key Features

- ** AI-Powered Pose Analysis**: Real-time pose detection using MediaPipe and custom ML models
- ** Mobile-First Design**: Cross-platform React application optimized for mobile devices
- ** Gamified Experience**: Leaderboards, badges, and competitive elements to drive engagement
- ** District-Level Competition**: Hyper-local competitions from district to national level
- ** Admin Dashboard**: SAI officials can identify and shortlist talent with heatmap visualization
- ** Offline-First**: Sync capabilities for areas with limited connectivity
- ** Multi-Sport Support**: Extendable framework supporting various athletic disciplines

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** with custom India-themed design system
- **Vite** for fast development and building
- **Shadcn/UI** components customized for athletic themes

### Backend (Planned Integration)
- **Firebase** (Auth, Firestore, Storage, Cloud Functions)
- **MediaPipe** for pose detection and analysis
- **TensorFlow Lite** for on-device ML inference

### Design System
- **Colors**: India flag inspired palette (Saffron #FF9933, White #FFFFFF, Green #128807, Blue #0033A0)
- **Typography**: Hind for Hindi text, Noto Sans for English
- **Animations**: Athletic-themed with smooth transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with camera access

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sportify

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checker
```

## 📱 Application Features

### 🎭 Athlete Onboarding
- **Multi-step welcome flow** with India-themed visuals
- **Bilingual interface** (Hindi + English)
- **Profile creation** with district-level granularity
- **Motivational messaging** to encourage participation

### 🏠 Athlete Dashboard
- **Performance overview** with visual statistics
- **Recommended tests** based on user profile and progress
- **Achievement system** with unlockable badges
- **Progress tracking** with weekly/monthly insights
- **Leaderboard integration** (district and national rankings)

### 📹 Video Recording & Analysis
- **Real-time pose overlay** with exercise-specific guidance
- **AI-powered rep counting** with accuracy scoring
- **Posture error detection** with corrective feedback
- **Cheat detection** to ensure fair assessment
- **Offline recording** with sync when online

### 👨‍💼 Admin Dashboard
- **Talent heatmap** showing district-wise performance clusters
- **Athlete shortlisting** with filtering and search capabilities
- **Performance analytics** with exportable reports
- **SAI center integration** for talent pipeline management

## 🎯 MVP Implementation (3-Day Plan)

### Day 1: Foundation & UI
- [x] **Design System**: India-themed color palette and components
- [x] **Onboarding Flow**: Multi-step athlete registration
- [x] **Dashboard Layout**: Stats, recommendations, and navigation
- [x] **Admin Interface**: Basic layout with heatmap placeholder

### Day 2: Core Functionality
- [x] **Video Recording**: Camera integration with overlay
- [x] **Mock ML Analysis**: Simulated pose detection and rep counting
- [x] **State Management**: Data flow between components
- [x] **Responsive Design**: Mobile-optimized layouts

### Day 3: Integration & Polish
- [x] **Navigation Flow**: Seamless transitions between views
- [x] **Performance Optimization**: Smooth animations and interactions
- [x] **Accessibility**: Proper ARIA labels and contrast ratios
- [x] **Demo Mode**: Interactive showcase of all features

## 🔮 Roadmap & Next Steps

### Phase 1: Core Platform (Weeks 1-4)
- **Firebase Integration**
  - Authentication with phone/email
  - Firestore for user profiles and results
  - Cloud Storage for video files
- **Real ML Integration**
  - MediaPipe pose detection
  - Custom posture classification models
  - TensorFlow Lite conversion and optimization

### Phase 2: Advanced Features (Weeks 5-8)
- **Offline Capabilities**
  - Local video storage with SQLite
  - Background sync when online
  - Progressive Web App (PWA) features
- **Gamification Enhancement**
  - Achievement system with complex rules
  - Social features and sharing
  - Virtual coaching recommendations

### Phase 3: SAI Integration (Weeks 9-12)
- **Wearable Device Support**
  - Zigbee/BLE integration for IMU sensors
  - Real-time biometric data collection
  - Gateway development for data forwarding
- **Professional Tools**
  - Advanced analytics for coaches
  - Performance prediction models
  - Talent pipeline management

## 🏗️ Technical Architecture

### Component Structure
```
src/
├── components/
│   ├── ui/                 # Shadcn base components
│   ├── AthleteOnboarding   # Multi-step registration
│   ├── AthleteDashboard    # Main athlete interface
│   ├── AdminDashboard      # SAI official interface
│   ├── VideoRecorder       # AI-powered recording
│   └── SportifyHeader      # Navigation component
├── assets/                 # Images and media files
├── hooks/                  # Custom React hooks
└── lib/                    # Utilities and helpers
```

### Design System Tokens
```css
/* India Flag Inspired Palette */
--saffron: 28 100% 60%;           /* Primary action color */
--india-green: 120 88% 28%;       /* Success and secondary */
--india-blue: 217 100% 31%;       /* Accent and highlights */
--neutral-white: 0 0% 100%;       /* Base background */

/* Athletic Theme Gradients */
--gradient-saffron: linear-gradient(135deg, saffron, saffron-light);
--gradient-athletic: linear-gradient(135deg, india-blue, saffron);
```

## 🎨 Design Principles

### Visual Hierarchy
- **Primary Actions**: Saffron gradient buttons for main CTAs
- **Secondary Actions**: India green for supportive actions
- **Accent Elements**: India blue for highlights and navigation
- **Content Areas**: Clean white backgrounds with subtle borders

### Typography Scale
- **Athletic XL**: 6xl font for hero headings
- **Athletic LG**: 4xl font for section headers  
- **Athletic MD**: 2xl font for component titles
- **Body Text**: Optimized for readability with proper line height

### Animation Strategy
- **Smooth Transitions**: 0.3s cubic-bezier for general interactions
- **Bounce Effects**: 0.4s spring animations for success states
- **Performance**: GPU-accelerated transforms and opacity changes

## 🧪 Testing Strategy

### Unit Testing
```bash
# Test component rendering and interactions
npm run test

# Test with coverage
npm run test:coverage
```

### E2E Testing (Planned)
- **Onboarding Flow**: Complete user registration
- **Video Recording**: Camera access and basic functionality
- **Data Persistence**: Local storage and sync capabilities

### Performance Testing
- **Lighthouse Scores**: Target 90+ for all metrics
- **Core Web Vitals**: Optimized LCP, FID, and CLS
- **Mobile Performance**: Tested on various devices and network conditions

## 🔒 Security & Privacy

### Data Protection
- **Encrypted Storage**: Videos encrypted before cloud upload
- **User Consent**: GDPR-compliant consent flows
- **Data Retention**: Clear policies with user control
- **Parental Consent**: Required for users under 18

### Security Measures
- **Input Validation**: All user inputs sanitized and validated
- **Rate Limiting**: API protection against abuse
- **Authentication**: Secure token-based auth with Firebase
- **Privacy**: No personal data exposed in public leaderboards

## 🌍 Internationalization (i18n)

### Supported Locales
- **en-IN**: English (India) - Primary interface language
- **hi-IN**: Hindi (India) - Secondary interface language

### Implementation
```typescript
// Example bilingual strings
const strings = {
  welcome: {
    'en-IN': 'Welcome to Sportify',
    'hi-IN': 'स्वागत है Sportify में'
  },
  startTest: {
    'en-IN': 'Start Test',
    'hi-IN': 'टेस्ट शुरू करें'
  }
};
```

## 📊 Analytics & Metrics

### Key Performance Indicators (KPIs)
- **User Engagement**: Daily/Weekly active users
- **Conversion Rate**: Onboarding to first test completion
- **Retention**: 7-day and 30-day user retention
- **Performance**: Test completion rates and accuracy scores

### Success Metrics
- **10%** conversion from screening to wearable re-evaluation
- **40%** seven-day retention rate
- **90%+** rep counting accuracy within ±1 repetition
- **85%+** posture classification accuracy

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow ESLint and Prettier configurations
2. **Commit Messages**: Use conventional commit format
3. **Branch Strategy**: Feature branches with descriptive names
4. **Review Process**: All changes require review before merge

### Getting Started
```bash
# Create feature branch
git checkout -b feature/new-exercise-type

# Make changes and commit
git commit -m "feat: add boxing exercise detection"

# Push and create pull request
git push origin feature/new-exercise-type
```

## 📜 License

This project is developed for educational and demonstration purposes. All rights reserved.

## 🙏 Acknowledgments

- **Sports Authority of India (SAI)** for inspiration and athletic expertise
- **MediaPipe team** for open-source pose detection technology
- **React and TypeScript communities** for excellent development tools
- **Indian flag colors** for the beautiful and meaningful design palette

---

<div align="center">

** Built with passion for Indian athletics 🇮🇳**

*Empowering the next generation of champions through technology*

</div>
