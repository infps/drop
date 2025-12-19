# DROP Platform v2 - Mobile Apps Development Plan

## Technology Stack
- **Framework**: React Native with Expo
- **Router**: Expo Router v6
- **Navigation**: React Navigation (Bottom Tabs)
- **Icons**: @expo/vector-icons
- **Animations**: React Native Reanimated
- **Backend**: v2 Server (Hono + Bun + Prisma)

---

# 1. RIDER MOBILE APP - Complete Development Plan

## Phase 1: Project Setup & Authentication
- [ ] Install dependencies and configure Expo project
- [ ] Set up environment variables (.env configuration for API endpoints)
- [ ] Create API client/axios instance for server communication
- [ ] Set up Zustand/Redux for state management
- [ ] Implement authentication flow (OTP-based login)
  - [ ] Phone number input screen
  - [ ] OTP verification screen
  - [ ] Token storage (secure storage for JWT)
- [ ] Create auth middleware/context providers
- [ ] Set up error handling and toast notifications
- [ ] Implement app layout with bottom tab navigation
  - [ ] Dashboard tab
  - [ ] Orders tab
  - [ ] Earnings tab
  - [ ] Profile tab

## Phase 2: Core Features (Orders, Earnings, Navigation)
### Dashboard Screen
- [ ] Display rider statistics (trips completed, rating, earnings)
- [ ] Show current location with map integration
- [ ] Display "Online/Offline" toggle button
- [ ] List of available orders nearby
- [ ] Accept/Reject order functionality
- [ ] Real-time order notifications (socket.io integration)

### Orders Screen
- [ ] List of active deliveries
  - [ ] Order ID, pickup location, drop location
  - [ ] Customer details
  - [ ] Expected delivery time
- [ ] Completed deliveries history
- [ ] Order details view with full information
- [ ] Update order status (picked up, in transit, delivered)
- [ ] Contact customer functionality (phone/chat)

### Earnings Screen
- [ ] Display total earnings (today, this week, this month)
- [ ] Earnings breakdown by trips
- [ ] Payment history and wallet details
- [ ] Pending payouts
- [ ] Bank account details management

### Profile Screen
- [ ] View rider profile (name, phone, vehicle type, license)
- [ ] Edit profile information
- [ ] View documents (DL, insurance, etc.) with upload capability
- [ ] Settings (language, notifications)
- [ ] Logout functionality

## Phase 3: Advanced Features (Maps, Ratings, Documents)
### Real-time Delivery Tracking
- [ ] Integrate map service (React Native Maps or Leaflet)
- [ ] Show current rider location
- [ ] Display route from pickup to drop location
- [ ] ETA calculation and display
- [ ] Customer view: Allow customer to track rider in real-time

### Rating & Reviews
- [ ] Accept ratings from customers after delivery
- [ ] Display rider rating and review history
- [ ] View detailed feedback from customers

### Document Management
- [ ] Driver's License verification
- [ ] Insurance document upload and verification
- [ ] Background check status
- [ ] Document expiry tracking and reminders

### Push Notifications
- [ ] New order notifications
- [ ] Order cancellation alerts
- [ ] Payout reminders
- [ ] Document expiry warnings

## Phase 4: Testing & Optimization
- [ ] Unit tests for API integration
- [ ] Integration tests for critical flows (login, accept order, complete delivery)
- [ ] UI/UX testing on Android and iOS
- [ ] Performance optimization (lazy loading, image optimization)
- [ ] Build APK and IPA for testing
- [ ] Device testing (real devices, emulators)

---

# 2. USER/CUSTOMER MOBILE APP - Complete Development Plan

## Phase 1: Project Setup & Authentication
- [ ] Install dependencies and configure Expo project
- [ ] Set up environment variables for API endpoints
- [ ] Create API client for server communication
- [ ] Set up state management (Zustand/Redux)
- [ ] Implement authentication flow
  - [ ] Phone number input screen
  - [ ] OTP verification screen
  - [ ] User profile creation (first time login)
  - [ ] Token storage (secure JWT storage)
- [ ] Create auth context/providers
- [ ] Set up error handling and notifications
- [ ] Implement bottom tab navigation
  - [ ] Home/Discover tab
  - [ ] Search tab
  - [ ] Orders tab
  - [ ] Cart tab
  - [ ] Profile tab

## Phase 2: Core Features (Browse, Search, Cart)
### Home/Discover Screen
- [ ] Display categories (Restaurants, Grocery, Wine, Genie, Hyperlocal)
- [ ] Featured stores/vendors
- [ ] Promotional banners/offers
- [ ] Category browse with pagination
- [ ] Quick access to popular stores
- [ ] Location-based store filtering
- [ ] Search bar with quick actions

### Search Screen
- [ ] Search by restaurant/vendor name
- [ ] Search by dish/product name
- [ ] Filter results by category, rating, delivery time
- [ ] Sort by rating, distance, delivery time
- [ ] Recent searches display
- [ ] Trending items/searches

### Store/Vendor Detail Screen
- [ ] Store information (name, rating, delivery time, distance)
- [ ] Menu/Products display with images
- [ ] Filter menu by category
- [ ] Product details (price, description, ingredients, allergens)
- [ ] Add to cart with quantity
- [ ] Customization options (size, toppings, etc.)
- [ ] Reviews and ratings display
- [ ] Store timing and availability

### Cart Screen
- [ ] List all items in cart
- [ ] Quantity adjustment
- [ ] Remove items
- [ ] Subtotal and fee calculation
- [ ] Promo code/coupon input
- [ ] Estimated delivery time
- [ ] Proceed to checkout button
- [ ] Save cart for later

## Phase 3: Orders & Checkout
### Checkout Flow
- [ ] Select delivery address
  - [ ] Show saved addresses
  - [ ] Add new address
  - [ ] Map-based location picker
- [ ] Delivery type selection (Standard, Express)
- [ ] Delivery instructions input
- [ ] Contact information confirmation
- [ ] Payment method selection
  - [ ] Razorpay integration
  - [ ] Saved cards
  - [ ] Wallet/cash options
- [ ] Order review and confirmation
- [ ] Order placed confirmation screen

### Orders Screen
- [ ] Active orders list with order status
  - [ ] Order ID, restaurant, items, total
  - [ ] Current status (preparing, on the way, delivered)
- [ ] Order tracking with real-time updates
  - [ ] Order status timeline
  - [ ] Rider location tracking (map view)
  - [ ] Estimated delivery time
- [ ] Past orders history with filters
- [ ] Rate and review orders
- [ ] Reorder functionality
- [ ] Cancel order (if permitted)
- [ ] Contact support for order issues

## Phase 4: Advanced Features (Tracking, Wallet, Loyalty)
### Order Tracking
- [ ] Real-time order status updates via socket.io
- [ ] Restaurant preparation progress
- [ ] Rider tracking with live map
- [ ] Push notifications for status updates
- [ ] ETA countdown

### Wallet & Payment
- [ ] View wallet balance
- [ ] Add money to wallet
- [ ] View transaction history
- [ ] Refund tracking
- [ ] Payment method management
- [ ] Saved cards management

### Loyalty & Referral
- [ ] Loyalty points display and history
- [ ] Redeem loyalty points
- [ ] Referral program information
- [ ] Generate referral link/code
- [ ] Track referred users and earnings

### Party Mode
- [ ] Create party orders
- [ ] Invite friends (link sharing)
- [ ] Collaborative cart
- [ ] Individual item tracking within party
- [ ] Bill split calculation
- [ ] Share party details

### User Profile
- [ ] View and edit profile information
- [ ] Manage addresses
  - [ ] Add, edit, delete addresses
  - [ ] Set default address
  - [ ] Saved locations (home, work, etc.)
- [ ] Manage payment methods
- [ ] View favorites/saved items
- [ ] Settings (language, notifications, privacy)
- [ ] Account security (change password, 2FA)

## Phase 5: Testing & Optimization
- [ ] Unit tests for components and utilities
- [ ] Integration tests for checkout flow and payment
- [ ] End-to-end testing for order placement
- [ ] UI testing on multiple devices
- [ ] Performance optimization
- [ ] Crash reporting and analytics setup
- [ ] Build APK and IPA

---

# 3. VENDOR MOBILE APP - Complete Development Plan

## Phase 1: Project Setup & Authentication
- [ ] Install dependencies and configure Expo project
- [ ] Set up environment variables
- [ ] Create API client for server communication
- [ ] Set up state management
- [ ] Implement authentication
  - [ ] Email/Phone login screen
  - [ ] Password reset functionality
  - [ ] Token storage and management
- [ ] Create auth context/providers
- [ ] Set up error handling
- [ ] Implement bottom tab navigation
  - [ ] Dashboard tab
  - [ ] Orders tab
  - [ ] Menu tab
  - [ ] Analytics tab
  - [ ] Profile tab

## Phase 2: Core Features (Dashboard, Orders, Menu)
### Dashboard Screen
- [ ] Display key metrics
  - [ ] Total orders today
  - [ ] Total revenue
  - [ ] Average rating
  - [ ] Estimated earnings
- [ ] Quick stats cards
- [ ] Recent orders list (last 5)
- [ ] Online/Offline toggle
- [ ] Quick action buttons (view orders, add menu items)
- [ ] Notification center
- [ ] Business hours display and edit

### Orders Screen
- [ ] Active orders list
  - [ ] Order ID, customer name, items
  - [ ] Order status (pending, preparing, ready, completed)
  - [ ] Order total
- [ ] Filters (pending, in progress, completed)
- [ ] Order details view
  - [ ] Full order information
  - [ ] Items breakdown
  - [ ] Customer details
  - [ ] Special instructions
- [ ] Update order status
  - [ ] Mark as confirmed/accepted
  - [ ] Mark as preparing
  - [ ] Mark as ready for pickup
- [ ] View completed orders history
- [ ] Search and filter orders by date/ID
- [ ] Estimated prep time management

### Menu Management
- [ ] View all menu items
- [ ] Add new items
  - [ ] Item name, description, price
  - [ ] Category selection
  - [ ] Image upload
  - [ ] Availability toggle
  - [ ] Customization options
- [ ] Edit menu items
- [ ] Delete menu items
- [ ] Organize menu by categories
- [ ] Bulk actions (enable/disable items)
- [ ] Special menu for specific dates/times
- [ ] Out of stock management

## Phase 3: RMS Features (Kitchen Display, Reservations)
### Kitchen Display System (KDS)
- [ ] Display incoming orders on kitchen screen
- [ ] Show order items with preparation time
- [ ] Mark items as prepared
- [ ] Order completion status
- [ ] Print order receipts
- [ ] Alert system for new orders

### Reservations Management
- [ ] View reservation list for the day
- [ ] Reservation details (name, party size, time)
- [ ] Check-in/Check-out tracking
- [ ] Manage table assignments
- [ ] Reservation history
- [ ] Cancellation handling

### Dine-In Orders
- [ ] Take table orders
- [ ] Link orders to tables
- [ ] KDS integration
- [ ] Bill generation
- [ ] Payment handling
- [ ] Table management

## Phase 4: Advanced Features (Analytics, Staff, Inventory)
### Analytics Dashboard
- [ ] Sales charts (daily, weekly, monthly)
- [ ] Revenue breakdown by category
- [ ] Top-selling items
- [ ] Customer metrics
  - [ ] New vs returning customers
  - [ ] Average order value
  - [ ] Customer satisfaction ratings
- [ ] Order analytics
  - [ ] Peak hours
  - [ ] Average prep time
  - [ ] Cancellation rate
- [ ] Export reports

### Staff Management
- [ ] View staff members
- [ ] Add/remove staff
- [ ] Assign roles (manager, chef, server)
- [ ] Shift management
- [ ] Staff performance metrics
- [ ] Attendance tracking

### Inventory Management
- [ ] Track inventory levels for ingredients
- [ ] Set low stock alerts
- [ ] Receive inventory
- [ ] Manage stock adjustments
- [ ] Link inventory to menu items
- [ ] Supplier management
- [ ] Inventory reports

### Settings & Configuration
- [ ] Manage business information (name, address, hours)
- [ ] Bank account details for payouts
- [ ] Commission and fee settings
- [ ] Notification preferences
- [ ] App version and updates

## Phase 5: Testing & Optimization
- [ ] Unit tests for components and services
- [ ] Integration tests for order flow
- [ ] KDS functionality testing
- [ ] Performance testing
- [ ] Multi-device testing (tablets, phones)
- [ ] Build APK and IPA for distribution

---

## Development Sequence

### Recommended Order (Sequential Completion)
1. **Rider App** (4-6 weeks)
   - Simpler feature set
   - Good foundation for mobile architecture
   - Real-time features provide good learning for orders

2. **User App** (6-8 weeks)
   - Larger feature set
   - Can reuse patterns from Rider App
   - More complex checkout/payment flows

3. **Vendor App** (6-8 weeks)
   - Most complex application
   - Can leverage patterns from previous apps
   - More admin-focused features

---

## Shared Components & Utilities

Create these shared across all apps:
- [ ] API client configuration and interceptors
- [ ] Authentication hooks and context
- [ ] Error handling and logging utilities
- [ ] Notification/Toast components
- [ ] Common UI components (buttons, modals, cards)
- [ ] Form validation utilities
- [ ] Type definitions/interfaces
- [ ] Constants (API endpoints, app config)

---

## Backend API Endpoints Reference

### Authentication Routes
- `POST /auth/login` - Login with credentials
- `POST /auth/otp/send` - Send OTP
- `POST /auth/otp/verify` - Verify OTP
- `POST /auth/logout` - Logout
- `GET /auth/profile` - Get current user profile

### Rider Routes
- `GET /rider/orders` - Get available orders
- `POST /rider/orders/:id/accept` - Accept order
- `POST /rider/orders/:id/update-status` - Update order status
- `GET /rider/earnings` - Get earnings data
- `GET /rider/profile` - Get rider profile

### User Routes
- `GET /user/profile` - Get user profile
- `POST /user/profile/update` - Update profile
- `GET /user/addresses` - Get saved addresses
- `POST /user/addresses` - Add new address

### Orders Routes
- `POST /orders/create` - Create order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details
- `POST /orders/:id/cancel` - Cancel order
- `POST /orders/:id/rate` - Rate order

### Cart Routes
- `GET /cart` - Get cart items
- `POST /cart/add` - Add item to cart
- `POST /cart/remove` - Remove from cart
- `POST /cart/clear` - Clear cart

### Products Routes
- `GET /products` - Get products
- `GET /products/:id` - Get product details
- `GET /products/search` - Search products

### Vendor Routes
- `GET /vendor/dashboard` - Get dashboard data
- `GET /vendor/orders` - Get vendor orders
- `POST /vendor/orders/:id/status` - Update order status
- `GET /vendor/menu` - Get menu items
- `POST /vendor/menu/add` - Add menu item
- `POST /vendor/menu/:id/update` - Update menu item

### Search Routes
- `GET /search` - Search stores and products
- `GET /search/suggestions` - Get search suggestions

### Notifications Routes
- `POST /notifications/send` - Send notification
- `GET /notifications` - Get notifications

### Payments Routes
- `POST /payments/razorpay/create-order` - Create Razorpay order
- `POST /payments/razorpay/verify` - Verify payment

---

## Environment Variables Template

```
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=30000

# Feature Flags
REACT_APP_ENABLE_KDS=true
REACT_APP_ENABLE_PARTY_MODE=true

# Payment
REACT_APP_RAZORPAY_KEY_ID=your_key_id

# Analytics (Optional)
REACT_APP_ANALYTICS_KEY=your_analytics_key
```

---

## Success Criteria

### Rider App
- Users can complete 100% of delivery workflow (accept, track, complete)
- Real-time order notifications working
- Maps integration functional
- Earnings accurately calculated

### User App
- Users can browse and order from stores
- Checkout process is intuitive and secure
- Order tracking is real-time
- Payment processing is reliable

### Vendor App
- Vendors can manage orders efficiently
- Dashboard metrics are accurate
- Menu management is straightforward
- Kitchen Display System is functional

---

## Testing Checklist

For each app:
- [ ] All screens render without errors
- [ ] Navigation between tabs works smoothly
- [ ] API calls handle errors gracefully
- [ ] Offline state is handled appropriately
- [ ] Images load and cache properly
- [ ] Forms validate inputs correctly
- [ ] Payment flows are secure
- [ ] Real-time updates work (socket.io)
- [ ] Performance is acceptable (< 3s load time)
- [ ] Accessibility is considered
