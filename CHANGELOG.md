# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Batch prediction for multiple locations
- User accounts and prediction history
- Dark mode theme
- Mobile application (React Native)

## [1.0.0] - 2025-10-05

### Added
- 🎉 Initial release of PreWeather
- 🗺️ Interactive Leaflet-based map with location selection
- 🔍 Global address search with OpenStreetMap Nominatim API
- 📅 Date picker with 365-day future prediction support
- 🌡️ 8 meteorological metrics prediction:
  - T2M (Temperature)
  - PRECTOTCORR (Precipitation)
  - RH2M (Relative Humidity)
  - WS2M (Wind Speed)
  - QV2M (Specific Humidity)
  - T2MDEW (Dew Point)
  - CLOUD_AMT (Cloud Coverage)
  - ALLSKY_SFC_SW_DWN (Solar Radiation)
- 🤖 AI-powered agricultural advice with DeepL translation
- 📊 Historical climate data (1981-2010) visualization
- 📈 Interactive line charts with customizable metrics
- 📤 Data export in multiple formats (JSON, CSV, PNG, PDF)
- 🌐 Multi-language support (Turkish & English)
- 🔗 URL state management for shareable links
- 💾 Local storage for user preferences
- 🎨 Responsive design for mobile, tablet, and desktop
- 🚀 React 19 and TypeScript implementation
- ⚡ Vite build system for optimal performance
- 🔐 Vercel serverless functions for secure API proxying

### Features

#### Location Selection
- Click anywhere on the map to select coordinates
- Automatic reverse geocoding for address display
- Water body detection with validation
- Address search with autocomplete suggestions
- Map centering and zoom on selection

#### Date Selection
- Calendar picker with month navigation
- Past dates disabled
- Maximum 365 days future range
- DD.MM.YYYY format display
- Quick "Today" button

#### Prediction
- Real-time weather prediction using Prophet ML model
- 8 meteorological parameters
- Visual weather condition icons
- Reliability scores
- Loading state with animations

#### Results Display
- Detailed prediction panel
- Metric toggle visibility
- Unit conversion (°C/°F, m/s/km/h)
- Geographical information
- Date and coordinates display

#### Climate Data
- Historical data from 1981-2010
- Interactive line charts
- Multiple metric overlay
- Hover tooltips with year and value
- PNG and PDF export options

#### AI Insights
- Agricultural advice generation
- Turkish to English translation via DeepL
- Structured sections (Comment & Advice)
- Expandable raw JSON view
- Translation caching

#### Data Export
- JSON download with full prediction data
- CSV export (planned)
- Chart PNG export
- Chart PDF export
- Formatted file names with location and date

#### UI/UX
- Modern gradient design
- Smooth animations and transitions
- Loading states and spinners
- Error handling with user-friendly messages
- Toast notifications
- Responsive navigation header
- Mobile-optimized layout

### Technical

#### Architecture
- React 19.1 with functional components
- TypeScript 5.9 for type safety
- React Router 7.9 for client-side routing
- Context API for global state (translations)
- URL state management with useSearchParams
- Custom hooks for API calls

#### APIs Integration
- NASA POWER API for meteorological data
- Prophet ML model backend integration
- DeepL API for translations (proxied via Vercel)
- OpenStreetMap Nominatim for geocoding

#### Performance
- Code splitting and lazy loading
- Memoization for expensive computations
- Debounced search input
- Optimized re-renders
- Image optimization
- Vite hot module replacement

#### Deployment
- Vercel hosting with Edge Network
- Serverless functions for API proxying
- Automatic HTTPS
- Custom domain support
- Environment variable management

### Documentation
- Comprehensive README.md
- Contributing guidelines
- MIT License
- Environment variables template
- Code of conduct
- Changelog (this file)

### Pages

#### Home
- Hero section with animated background
- Feature showcase
- Statistics display
- Call-to-action buttons
- 3D weather sphere animation

#### About
- Mission statement
- Technology stack
- Roadmap visualization
- Team information

#### Documentation
- Sidebar navigation
- Scroll tracking
- Smooth scroll to sections
- Detailed user guide
- Tips and tricks

#### APIs
- List of used APIs
- Integration details
- Credit attributions

#### App
- Main application interface
- Full prediction workflow
- Complete feature set

## [0.2.0] - 2025-09-20 (Beta)

### Added
- Beta release for testing
- Core prediction functionality
- Basic UI components
- Map integration

### Fixed
- Map marker positioning
- Date validation logic
- API error handling

## [0.1.0] - 2025-09-01 (Alpha)

### Added
- Initial prototype
- Project structure
- Basic React setup
- NASA API integration test

---

## Legend

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` in case of vulnerabilities

---

<div align="center">

[View Full History](https://github.com/firatmio/preweather/releases)

</div>
