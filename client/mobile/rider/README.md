# Drop Rider Mobile App - Product Requirements Document

## Overview

The Drop Rider Mobile App is a delivery partner application that enables riders to receive, manage, and complete deliveries within the Drop platform. Riders can browse available orders, accept deliveries, track their locations in real-time, and monitor their earnings.

**Platform**: iOS/Android (Expo + React Native)
**Target Users**: Delivery partners, independent contractors, fleet riders
**Core Purpose**: Enable efficient order fulfillment and real-time delivery tracking

---

## 1. Key Features

### 1.1 Authentication & Onboarding
- **OTP-based Login**: Phone number verification using One-Time Password
- **Profile Setup**: Complete rider profile with vehicle details and documents
- **Document Verification**: Upload and track verification status (driving license, police clearance)
- **Account Management**: Toggle online/offline status, view verification progress

### 1.2 Dashboard / Home Screen
- **Quick Stats**: Display today's earnings, deliveries completed, active orders
- **Status Toggle**: Switch between online and offline modes
- **Available Orders Count**: Quick indicator of pending deliveries
- **Profile Access**: Quick navigation to profile and settings
- **Welcome Message**: Personalized greeting with rider name

### 1.3 Order Management
- **Browse Available Orders**: List of orders ready for pickup (READY_FOR_PICKUP status)
- **Order Acceptance**: Accept available orders with one tap
- **Order Tracking**: Accept, pickup, and deliver orders with status updates
- **Order Filtering**: Filter orders by distance, earnings, vendor type
- **Order Details**: View complete order information including items, pricing, addresses

### 1.4 Real-time Delivery Tracking
- **Live Map Integration**: Show rider, vendor, and customer locations on map
- **Route Navigation**: Display route from vendor to customer
- **Distance & ETA**: Show distance to vendor/customer and estimated time
- **Location Permission Handling**: Request and manage location permissions gracefully

### 1.5 Earnings & Analytics
- **Daily Earnings Summary**: Total earnings, base fare, tips, incentives
- **Period Selection**: View earnings for today, week, month, or all-time
- **Detailed History**: Paginated list of individual earnings records
- **Performance Metrics**: Total deliveries, average rating, acceptance rate
- **Withdrawal Management**: Request payouts to linked bank account

### 1.6 Profile Management
- **Personal Information**: Edit name, avatar, language preference
- **Vehicle Details**: Add/update vehicle type, registration number, model
- **Bank Information**: Add bank account for payouts (IFSC code, account number)
- **Document Management**: View verification status and upload missing documents
- **Ratings & Reviews**: View customer ratings and feedback
- **Settings**: Language, notification preferences, help, logout

---

## 2. Core Screens

### 2.1 Authentication Stack
#### Screen: Login
- Phone number input with country code selector
- Continue/Next button
- Link to help/support

#### Screen: OTP Verification
- OTP input field (6 digits)
- Countdown timer for resend
- Resend OTP link
- Auto-verify when all digits entered

### 2.2 Tabbed Navigation (Bottom Tabs)
Five main navigation tabs:

#### Tab 1: Home (Dashboard)
- Rider's daily stats card
- Online/offline status toggle
- Quick action buttons (view available orders, view active deliveries)
- Latest earnings summary
- Motivational message/incentives

#### Tab 2: Orders (Available)
- List of available orders to accept
- Search and filter options
- Order cards showing:
  - Vendor name and logo
  - Pickup location
  - Delivery location
  - Estimated delivery fee
  - Distance to vendor
  - Item count
- Accept button on each card
- Map preview option

#### Tab 3: Active (In-Progress)
- List of rider's active deliveries
- Grouped by status if needed
- For each active order:
  - Full map showing route
  - Status indicator
  - Action button (Pickup or Deliver)
  - Quick contact buttons (vendor, customer)
  - Real-time location tracking
  - Estimated time remaining

#### Tab 4: Earnings (Wallet)
- Total earnings card with today's summary
- Period selector (Today/Week/Month/All)
- Earnings breakdown by type:
  - Base fare
  - Tips received
  - Incentives/bonuses
  - Penalties (if any)
- Graph/chart showing earnings trend
- Earnings history (paginated)
- Withdrawal button and history

#### Tab 5: Profile (Account)
- Rider avatar and name
- Quick stats (rating, deliveries, status)
- Menu sections:
  - Personal Information (editable)
  - Vehicle Information (editable)
  - Bank Details (editable, for payouts)
  - Document Verification
  - Ratings & Reviews
  - Settings
  - Help & Support
  - Logout

### 2.3 Modal/Detail Screens

#### Screen: Order Details
- Full order information
- Item list with images
- Vendor details (name, address, phone, distance)
- Customer details (name, phone, delivery address)
- Pricing breakdown (subtotal, delivery fee, tax)
- Status history timeline
- Accept/Pickup/Deliver buttons based on current status
- Contact buttons (WhatsApp, call)

#### Screen: Order Map
- Full-screen map for active delivery
- Rider's current location (blue dot)
- Vendor location (pickup point)
- Customer location (delivery point)
- Route line connecting all points
- Distance and ETA displays
- Bottom sheet with order summary
- Floating action buttons for actions

---

## 3. Technical Requirements

### 3.1 Technology Stack
- **Framework**: Expo v54 + React Native v0.81
- **Language**: TypeScript 5.9
- **Routing**: Expo Router v6 (file-based routing)
- **Navigation**: React Navigation v7 (Bottom Tabs)
- **State Management**: Context API with custom hooks (or Zustand if needed)
- **API Communication**: axios with interceptors for JWT handling
- **Maps**: react-native-maps
- **Location**: expo-location for geolocation
- **Date Handling**: date-fns for date/time operations
- **Icons**: @expo/vector-icons
- **Notifications**: expo-notifications for push notifications

### 3.2 API Integration
**Base URL**: `http://localhost:3001/api/v1` (configurable via environment)

**Key Endpoints**:
- `POST /auth/send-otp` - Request OTP for login
- `POST /auth/verify-otp` - Verify OTP and get JWT token
- `GET /rider/orders` - Fetch available/active orders
- `POST /rider/orders/accept` - Accept or update order status
- `POST /rider/location` - Update current location
- `GET /rider/earnings` - Fetch earnings data
- `GET /rider/profile` - Get rider profile details
- `PUT /rider/profile` - Update rider profile
- `GET /orders/{id}` - Get order details

### 3.3 State Management Structure
- **AuthContext**: Authentication state, JWT token, user info
- **RiderContext**: Rider profile, stats, current online status
- **OrdersContext**: Available orders, active orders, selected order
- **LocationContext**: Current location, location tracking state

### 3.4 Local Storage
- JWT token for session management
- Rider profile cache
- Recent searches/filters
- User preferences (language, notifications)

### 3.5 Permissions Required
- **Location**: Foreground + background (for real-time tracking)
- **Camera**: For taking vehicle photos and document uploads
- **Contacts**: For quick calling features
- **Notifications**: For order alerts and updates

### 3.6 Performance Considerations
- Lazy load screens to reduce bundle size
- Image optimization and caching
- Memoize expensive components
- Efficient re-renders with useMemo/useCallback
- Map optimization for high-frequency location updates
- Background task optimization for location tracking

---

## 4. User Workflows

### 4.1 Onboarding Workflow
1. App opens → Check if logged in
2. If not logged in → Login screen
3. Enter phone number
4. Receive and enter OTP
5. JWT token stored locally
6. Redirect to home screen
7. Optional: Complete profile setup if first time

### 4.2 Accepting Order Workflow
1. User on Orders tab (available orders list)
2. Browse available orders
3. Tap "Accept" on desired order
4. Confirmation dialog
5. Order status changes to "Accepted"
6. Order moves to Active tab
7. Map screen opens for navigation

### 4.3 Completing Delivery Workflow
1. User on Active tab with ongoing order
2. Navigate to vendor (map guidance)
3. Tap "Pickup" button when at vendor location
4. Order status → PICKED_UP
5. Navigate to customer address
6. Tap "Deliver" button when at customer location
7. Confirmation and feedback collection
8. Order status → DELIVERED
9. Earnings credited
10. Back to orders list

### 4.4 Checking Earnings Workflow
1. User on Earnings tab
2. View today's summary card
3. Select different period (week/month)
4. Scroll through earnings history
5. Tap "Withdraw" for payout request
6. View withdrawal history

---

## 5. Non-Functional Requirements

### 5.1 Performance
- App should launch in < 3 seconds
- Order list should load within 2 seconds
- Map should load and be interactive within 3 seconds
- Location updates should sync every 5-10 seconds

### 5.2 Reliability
- Graceful offline mode with queue for location updates
- Automatic reconnection on network recovery
- Error boundaries for crash prevention
- Proper error messages for user guidance

### 5.3 Security
- JWT tokens stored in secure storage (not AsyncStorage)
- API requests include authorization headers
- HTTPS for all API calls
- No sensitive data in logs
- Biometric authentication support (future)

### 5.4 Usability
- Intuitive bottom tab navigation
- Clear visual feedback for button taps
- Haptic feedback on interactions
- Accessible color contrasts
- Support for dark and light modes

### 5.5 Compatibility
- iOS 13+
- Android 7+
- Support for various screen sizes and orientations

---

## 6. File Structure

```
rider/
├── app/                          # Expo Router app directory
│   ├── (auth)/                   # Authentication routes (hidden from tabs)
│   │   ├── _layout.tsx           # Auth stack layout
│   │   ├── login.tsx             # Phone number entry
│   │   └── verify-otp.tsx        # OTP verification
│   ├── (tabs)/                   # Main app with bottom tabs
│   │   ├── _layout.tsx           # Tab navigation configuration
│   │   ├── home.tsx              # Dashboard/Home tab
│   │   ├── orders.tsx            # Available orders tab
│   │   ├── active.tsx            # Active deliveries tab
│   │   ├── earnings.tsx          # Earnings/Wallet tab
│   │   └── profile.tsx           # Profile/Account tab
│   ├── order/
│   │   ├── [id].tsx              # Order detail modal
│   │   └── map.tsx               # Full screen map for active order
│   ├── _layout.tsx               # Root layout (conditional auth)
│   └── +not-found.tsx            # 404 page
│
├── services/
│   ├── api.ts                    # API client setup with interceptors
│   ├── auth-service.ts           # Auth API calls
│   ├── rider-service.ts          # Rider-specific API calls
│   ├── order-service.ts          # Order-related API calls
│   └── location-service.ts       # Geolocation service
│
├── context/
│   ├── auth-context.tsx          # Authentication state & provider
│   ├── rider-context.tsx         # Rider profile & stats state
│   └── location-context.tsx      # Real-time location state
│
├── hooks/
│   ├── use-auth.ts               # Authentication hook
│   ├── use-rider.ts              # Rider data hook
│   ├── use-location.ts           # Location tracking hook
│   ├── use-orders.ts             # Orders data hook
│   └── use-color-scheme.ts       # Theme/color scheme
│
├── components/
│   ├── common/
│   │   ├── header.tsx            # App header component
│   │   ├── button.tsx            # Custom button component
│   │   ├── input.tsx             # Custom input component
│   │   ├── loading.tsx           # Loading spinner
│   │   └── error-banner.tsx      # Error display
│   ├── order-card.tsx            # Order list item component
│   ├── order-details.tsx         # Order details display
│   ├── order-map.tsx             # Map component for orders
│   ├── earnings-card.tsx         # Earnings summary card
│   ├── rider-stats.tsx           # Stats display component
│   ├── status-badge.tsx          # Order status indicator
│   └── bottom-action.tsx         # Floating action button
│
├── types/
│   ├── rider.ts                  # Rider-related types
│   ├── order.ts                  # Order-related types
│   ├── api.ts                    # API response types
│   └── navigation.ts             # Navigation types
│
├── utils/
│   ├── constants.ts              # App constants
│   ├── formatting.ts             # Format functions (date, currency, etc.)
│   ├── location-utils.ts         # Location calculation helpers
│   ├── storage.ts                # Secure storage helpers
│   └── helpers.ts                # General utility functions
│
├── assets/
│   ├── images/                   # App images
│   ├── icons/                    # Custom icons
│   └── illustrations/            # SVG illustrations
│
├── constants/
│   └── theme.ts                  # Colors, fonts, spacing
│
├── app.json                      # Expo configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── .env.example                  # Environment variables template
```

---

## 7. Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Setup project dependencies and configuration
- [ ] Create API service layer with interceptors
- [ ] Implement authentication context and screens
- [ ] Setup local storage for token management
- [ ] Create type definitions

### Phase 2: Core Screens (Week 2)
- [ ] Implement home/dashboard screen
- [ ] Create available orders list screen
- [ ] Build order details screen
- [ ] Setup navigation and routing
- [ ] Create basic UI components

### Phase 3: Active Deliveries (Week 3)
- [ ] Implement active orders screen
- [ ] Integrate map for delivery tracking
- [ ] Setup real-time location updates
- [ ] Create order action buttons
- [ ] Add contact functionality

### Phase 4: Earnings & Profile (Week 4)
- [ ] Implement earnings screen with charts
- [ ] Build profile management screen
- [ ] Add bank details input
- [ ] Create document verification UI
- [ ] Implement settings

### Phase 5: Polish & Testing (Week 5)
- [ ] Add notifications integration
- [ ] Implement offline support
- [ ] Performance optimization
- [ ] Bug fixes and refinement
- [ ] Testing on physical devices

---

## 8. Getting Started

### Installation
```bash
cd /Users/roydevelops/Desktop/Dev/Companies/Infiniti/drop/v2/client/mobile/rider

# Install dependencies
npm install
# or
bun install

# Setup environment
cp .env.example .env
# Edit .env with your API base URL
```

### Running the App
```bash
# Start development server
npx expo start

# Options:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app
```

### Building for Production
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## 9. API Reference Summary

See the main server README at `/v2/server/API_ROUTES.md` for complete API documentation.

**Key Rider Endpoints**:
- `GET /rider/orders?type=available` - List available orders
- `GET /rider/orders?type=active` - List active deliveries
- `POST /rider/orders/accept` - Accept/update order
- `POST /rider/location` - Update rider location
- `GET /rider/earnings?period=today` - Get earnings
- `GET /rider/profile` - Get rider details
- `PUT /rider/profile` - Update rider profile

---

## 10. Success Metrics

- **User Retention**: 70%+ daily active users
- **Order Completion Rate**: 95%+ orders completed successfully
- **Average Rating**: 4.5+ stars from customers
- **App Performance**: < 3 second launch time
- **Location Accuracy**: 95%+ accurate delivery locations
- **Earnings Visibility**: 100% earnings tracked and displayed accurately

---

## 11. Future Enhancements

- Biometric authentication (Face ID/Touch ID)
- Voice-guided navigation
- Batch deliveries/multi-drop support
- Rider community/social features
- Advanced analytics dashboard
- Predictive earnings forecasting
- In-app training and onboarding
- Vehicle maintenance tracking

---

## Notes for Development Team

1. **Backend Status**: All API endpoints are implemented and documented in the server
2. **Database**: PostgreSQL with Prisma ORM, ready for integration
3. **Authentication**: JWT-based with OTP verification
4. **Location Tracking**: Real-time updates required every 5-10 seconds
5. **Maps**: Use react-native-maps with Google Maps API
6. **State Management**: Start with Context API, migrate to Zustand if needed
7. **Testing**: Plan for both iOS and Android testing early
8. **Documentation**: Keep in-code comments for complex logic

---

**Last Updated**: December 19, 2025
**Version**: 1.0
**Status**: Ready for Development
