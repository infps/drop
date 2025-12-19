# DROP Mobile Apps - Summary & Screen Count

## 📱 Complete Screen Inventory

### 1️⃣ RIDER MOBILE APP
**Total Screens: 15**

#### Auth Stack (3 screens)
1. LoginScreen - Phone number input & validation
2. OTPVerificationScreen - OTP entry & verification
3. ProfileCreationScreen - Rider profile setup (name, vehicle, license)

#### Dashboard Tab (3 screens + modals)
4. DashboardScreen - Stats, online toggle, available orders
5. OrderDetailsScreen (modal) - Quick order preview
6. MapViewScreen - Full-screen map of available orders

#### Orders Tab (3 screens + modals)
7. OrdersListScreen - Active & completed orders
8. OrderDetailsScreen (full view) - Complete order details
9. TrackingMapScreen - Real-time delivery tracking
10. RatingScreen - Customer rating & review

#### Earnings Tab (4 screens)
11. EarningsOverviewScreen - Daily/weekly/monthly earnings
12. EarningsDetailsScreen - Detailed breakdown with charts
13. PayoutHistoryScreen - Past payouts & next payout info
14. BankAccountScreen - Bank details & account management

#### Profile Tab (3 screens)
15. ProfileScreen - Rider profile overview
16. EditProfileScreen - Edit profile information
17. DocumentsScreen - License, insurance, background check
18. SettingsScreen - Notifications, location, language, account
19. HelpScreen - FAQs, support contact, issue reporting

---

### 2️⃣ USER/CUSTOMER MOBILE APP
**Total Screens: 23**

#### Auth Stack (3 screens)
1. LoginScreen - Phone number input
2. OTPVerificationScreen - OTP verification
3. ProfileCreationScreen - User profile setup

#### Home Tab (3 screens)
4. HomeScreen - Location, search, categories, featured stores, banners
5. CategoryScreen (modal) - Stores by category with filtering
6. StoreDetailsScreen - Store info, menu, reviews

#### Search Tab (3 screens)
7. SearchScreen - Recent searches, trending, suggestions
8. SearchResultsScreen - Results with tabs (restaurants/dishes/products)
9. FilterScreen (modal) - Ratings, delivery time, price range filters

#### Orders Tab (4 screens)
10. OrdersListScreen - Active & past orders
11. OrderDetailsScreen - Order details & timeline
12. TrackingScreen - Map-based order tracking
13. RatingScreen - Rate order & leave review

#### Cart Tab (4 screens + modals)
14. CartScreen - Cart items, quantity, summary
15. CheckoutScreen (Step 1) - Address selection
16. CheckoutScreen (Step 2) - Delivery options
17. CheckoutScreen (Step 3) - Payment method selection
18. CheckoutScreen (Step 4) - Order confirmation
19. AddressSelectionScreen (modal) - Saved addresses
20. AddEditAddressScreen (modal) - Add/edit address

#### Profile Tab (8 screens)
21. ProfileScreen - User profile overview
22. EditProfileScreen - Edit profile info
23. AddressesScreen - Saved addresses list
24. AddEditAddressScreen (modal) - Address management
25. PaymentMethodsScreen - Saved cards management
26. FavoritesScreen - Favorite stores & items
27. WalletScreen - Wallet balance & transactions
28. LoyaltyScreen - Loyalty points & redemption
29. ReferralScreen - Referral code & earnings
30. SettingsScreen - Notifications, language, security
31. SupportScreen - FAQs, contact support, report issue

#### Additional Screens
32. ProductDetailsScreen (modal) - Product info, customizations, reviews

---

### 3️⃣ VENDOR MOBILE APP
**Total Screens: 21**

#### Auth Stack (3 screens)
1. LoginScreen - Email/password login
2. ForgotPasswordScreen - Password reset request
3. PasswordResetScreen - Set new password

#### Dashboard Tab (3 screens)
4. DashboardScreen - Key metrics, online toggle, recent orders, notifications
5. AnalyticsDetailScreen (modal) - Detailed metrics with charts
6. NotificationsScreen - All notifications history

#### Orders Tab (4 screens + modals)
7. OrdersListScreen - Orders with status filters
8. OrderDetailsScreen - Full order details & status update
9. KitchenDisplayScreen - KDS interface (column-based order management)
10. PrintOrderScreen (modal) - Print preview & sharing

#### Menu Tab (4 screens + modals)
11. MenuListScreen - Menu items by category
12. MenuItemScreen - Item details & reviews
13. AddEditItemScreen (modal) - Add/edit menu item
14. BulkActionsScreen (modal) - Bulk operations on menu items

#### Analytics Tab (4 screens)
15. AnalyticsOverviewScreen - Key metrics & overview
16. SalesChartScreen - Sales charts & detailed analytics
17. CustomerMetricsScreen - Customer data & reviews
18. ReportsScreen - Predefined & custom reports

#### Profile Tab (7 screens)
19. ProfileScreen - Store profile overview
20. EditProfileScreen - Edit store information
21. StoreSettingsScreen - Business hours, delivery, payment settings
22. BankAccountScreen - Bank details & payout history
23. StaffScreen - Staff management
24. InventoryScreen - Inventory tracking
25. SupportScreen - FAQs & support contact

---

## 🎯 Total Screen Count by App

| App | Auth | Tab 1 | Tab 2 | Tab 3 | Tab 4 | Tab 5 | Modals | **Total** |
|-----|------|-------|-------|-------|-------|-------|--------|----------|
| **Rider** | 3 | 3 | 3 | 4 | 3 | - | 3 | **19** |
| **User** | 3 | 3 | 3 | 4 | 4 | 8 | 4 | **32** |
| **Vendor** | 3 | 3 | 4 | 4 | 4 | 7 | 4 | **25** |
| **TOTAL** | **9** | **9** | **11** | **12** | **12** | **15** | **11** | **76 screens** |

---

## 📊 Complexity Breakdown

### Navigation Structure

#### Rider App - Bottom Tab Navigation
```
Auth → Main Stack (4 Tabs)
  ├── Dashboard (with modals)
  ├── Orders (with nested screens)
  ├── Earnings (4 screens)
  └── Profile (5 screens)
```

#### User App - Bottom Tab Navigation
```
Auth → Main Stack (5 Tabs)
  ├── Home (with modals)
  ├── Search (with modals)
  ├── Orders (with nested screens)
  ├── Cart (with checkout flow)
  └── Profile (8 screens)
```

#### Vendor App - Bottom Tab Navigation
```
Auth → Main Stack (5 Tabs)
  ├── Dashboard (with modals)
  ├── Orders (KDS + details)
  ├── Menu (with modals)
  ├── Analytics (4 detailed screens)
  └── Profile (7 management screens)
```

---

## 🔌 API Endpoints Integration

### Total Endpoints Required: ~40

#### Authentication Routes (5)
- POST `/auth/otp/send`
- POST `/auth/otp/verify`
- POST `/auth/login`
- POST `/auth/forgot-password`
- POST `/auth/reset-password`

#### Rider Routes (8)
- GET `/rider/dashboard`
- GET `/rider/orders`
- POST `/rider/orders/:id/accept`
- POST `/rider/orders/:id/reject`
- POST `/rider/orders/:id/update-status`
- GET `/rider/earnings`
- GET `/rider/payouts`
- GET/POST `/rider/bank-account`
- GET/POST `/rider/documents`
- GET/POST `/rider/settings`

#### User Routes (12)
- GET `/user/profile`
- POST `/user/profile/update`
- GET/POST `/user/addresses`
- GET/POST `/user/payment-methods`
- GET `/user/favorites`
- POST `/user/favorites/toggle`
- GET `/user/wallet`
- POST `/wallet/add-money`
- GET `/user/loyalty`
- POST `/user/loyalty/redeem`
- GET `/user/referral`
- POST `/user/settings`

#### Orders Routes (5)
- POST `/orders/create`
- GET `/orders`
- GET `/orders/:id`
- POST `/orders/:id/rate`
- POST `/orders/:id/cancel`

#### Products Routes (4)
- GET `/products`
- GET `/products/:id`
- GET `/products/featured-stores`
- GET `/products/store/:id`

#### Search Routes (2)
- GET `/search`
- GET `/search/suggestions`

#### Payments Routes (3)
- POST `/payments/razorpay/create-order`
- POST `/payments/razorpay/verify`
- POST `/cart/apply-promo`

#### Vendor Routes (15)
- GET `/vendor/dashboard`
- GET `/vendor/orders`
- POST `/vendor/orders/:id/status`
- GET `/vendor/menu`
- POST `/vendor/menu`
- PUT `/vendor/menu/:id`
- DELETE `/vendor/menu/:id`
- POST `/vendor/menu/bulk-update`
- POST `/vendor/analytics`
- GET `/vendor/analytics/sales`
- GET `/vendor/analytics/customers`
- POST `/vendor/reports/generate`
- POST `/vendor/profile/update`
- GET/POST `/vendor/settings`
- GET/POST `/vendor/bank-account`
- GET `/vendor/staff`
- POST `/vendor/staff`
- GET `/vendor/inventory`
- POST `/vendor/inventory`
- POST `/vendor/online-status`

#### Support Routes (2)
- GET `/support/faqs`
- POST `/support/report-issue`

---

## 🔌 Socket.io Events

### Real-time Communication Required

#### Rider App
- `rider:new-order` - New delivery available
- `rider:order-cancelled` - Order cancelled
- `rider:order-updated` - Order status changed
- `rider:location-update` - Location tracking

#### User App
- `order:status-updated` - Order status changed
- `order:rider-assigned` - Rider assigned
- `rider:location-updated` - Real-time tracking
- `notification:new` - New notification

#### Vendor App
- `vendor:new-order` - Incoming order
- `vendor:order-updated` - Order status changed
- `vendor:notification` - System notifications
- `vendor:online-status-changed` - Multi-device status sync

---

## 📁 File Structure Template

```
rider/
├── app/
│   ├── auth/
│   │   ├── login.tsx
│   │   ├── verify.tsx
│   │   └── profile.tsx
│   ├── (tabs)/
│   │   ├── dashboard/
│   │   │   ├── index.tsx
│   │   │   ├── order-details.tsx
│   │   │   └── map-view.tsx
│   │   ├── orders/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   ├── [id]/map.tsx
│   │   │   └── [id]/rate.tsx
│   │   ├── earnings/
│   │   │   ├── index.tsx
│   │   │   ├── details.tsx
│   │   │   ├── payouts.tsx
│   │   │   └── bank-account.tsx
│   │   └── profile/
│   │       ├── index.tsx
│   │       ├── edit.tsx
│   │       ├── documents.tsx
│   │       ├── settings.tsx
│   │       └── help.tsx
│   ├── _layout.tsx (Root layout)
│   └── +not-found.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Tabs.tsx
│   │   └── Badge.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── TabBar.tsx
│   └── [feature]/
├── lib/
│   ├── api.ts
│   ├── socket.ts
│   ├── storage.ts
│   ├── validation.ts
│   └── formatting.ts
├── store/
│   ├── authStore.ts
│   ├── orderStore.ts
│   ├── earningStore.ts
│   └── locationStore.ts
├── types/
│   ├── auth.ts
│   ├── order.ts
│   ├── rider.ts
│   └── index.ts
├── constants/
│   ├── colors.ts
│   ├── theme.ts
│   └── config.ts
├── app.json
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 📋 Development Checklist - Per App

### Rider App Checklist
- [ ] Auth system (login, OTP, profile creation)
- [ ] Dashboard with online/offline toggle
- [ ] Orders acceptance flow
- [ ] Real-time tracking map
- [ ] Earnings calculator
- [ ] Payout management
- [ ] Document uploads
- [ ] Rating system
- [ ] Settings & preferences
- [ ] Socket.io integration
- [ ] Push notifications
- [ ] Secure token storage

### User App Checklist
- [ ] Auth system (phone OTP)
- [ ] Home screen with categories
- [ ] Search & filtering
- [ ] Store catalog & menu
- [ ] Shopping cart
- [ ] Checkout flow
- [ ] Razorpay payment integration
- [ ] Real-time order tracking
- [ ] Order history & ratings
- [ ] Address management
- [ ] Wallet & payments
- [ ] Loyalty program
- [ ] Referral system
- [ ] Favorites management
- [ ] Socket.io integration

### Vendor App Checklist
- [ ] Auth system (email/password)
- [ ] Dashboard with metrics
- [ ] Order management
- [ ] Kitchen Display System (KDS)
- [ ] Menu management (CRUD)
- [ ] Sales analytics
- [ ] Customer metrics & reviews
- [ ] Payout management
- [ ] Staff management
- [ ] Inventory tracking
- [ ] Store settings
- [ ] Report generation
- [ ] Socket.io integration
- [ ] Print functionality

---

## 🎨 Component Reusability

### Shared Components (Across All Apps)
- Button variants (primary, secondary, danger, loading)
- Card component (with hover states)
- Input fields (text, email, password, number)
- Modal component
- Toast/Alert notifications
- Loading spinners
- Empty states
- Error boundaries
- Tab navigation

### Shared Utilities
- API client with interceptors
- Error handling
- Validation functions
- Storage helpers (secure storage)
- Formatting (currency, date, phone)
- Socket.io connection manager
- Environment configuration

---

## 🚀 Implementation Order

### Phase 1: Foundation (Week 1)
1. Set up shared libraries & utilities
2. Create base components & theme
3. Implement API client & Socket.io
4. Set up state management (Zustand stores)

### Phase 2: Rider App (Weeks 2-3)
1. Auth stack
2. Dashboard & Orders tabs
3. Earnings & Profile tabs
4. Real-time updates
5. Testing

### Phase 3: User App (Weeks 4-6)
1. Auth stack
2. Home & Search tabs
3. Orders & Cart tabs
4. Profile with addresses & wallet
5. Checkout flow integration
6. Testing

### Phase 4: Vendor App (Weeks 7-9)
1. Auth stack
2. Dashboard & Orders tabs
3. Menu management
4. Analytics
5. Profile settings
6. Testing

---

## 📱 Screen Types by Category

### Authentication Screens (9 total)
- Login screens (3)
- OTP verification (3)
- Password/Profile creation (3)

### Data Display Screens (25 total)
- List/Grid views (10)
- Detail views (8)
- Chart/Analytics (4)
- Timeline views (3)

### Form/Input Screens (18 total)
- Add/Edit forms (8)
- Checkout flow (4)
- Settings pages (6)

### Modal/Dialog Screens (11 total)
- Confirmations (3)
- Filters (2)
- Form modals (4)
- Preview/Print (2)

### Map Screens (3 total)
- Real-time tracking (2)
- Location picker (1)

---

## 🔄 Real-time Features

### Rider App
- Live order availability
- Order cancellation notifications
- Location tracking (broadcast)
- Payout notifications

### User App
- Order status updates
- Rider location tracking
- New order notifications
- Promotional notifications

### Vendor App
- Incoming order alerts
- Order status updates
- Multi-device sync
- Notification center

---

## 📊 Data Models Summary

### Core Models Required
- User (phone, profile, auth)
- Order (details, timeline, status)
- Product (menu items, categories)
- Store/Vendor (profile, settings)
- Address (formatted, coordinates)
- Payment (method, transaction)
- Rating (score, review, timestamp)
- Notification (type, content, read status)
- WalletTransaction (type, amount, timestamp)
- RideDetails (location, distance, earnings)

---

## ✅ Quality Checklist

- [ ] All screens responsive on 5.5"-6.5" phones
- [ ] Touch targets minimum 44x44px
- [ ] Loading states on all async operations
- [ ] Error states with helpful messages
- [ ] Offline support (if applicable)
- [ ] Image caching & optimization
- [ ] Form validation on all inputs
- [ ] Secure credential storage
- [ ] Smooth animations & transitions
- [ ] Accessibility (a11y) compliance
- [ ] Performance: < 3s initial load
- [ ] Bundle size < 30MB
- [ ] Push notifications working
- [ ] Real-time updates reliable
- [ ] Payment flow secure
