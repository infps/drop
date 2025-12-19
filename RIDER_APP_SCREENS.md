# RIDER MOBILE APP - Navigation & Screens

## Navigation Structure

```
RiderApp
├── Auth Stack
│   ├── LoginScreen (Phone Number Input)
│   ├── OTPVerificationScreen
│   └── ProfileCreationScreen
│
├── Main Stack (Bottom Tabs)
│   ├── Dashboard Tab
│   │   ├── DashboardScreen (Main)
│   │   ├── OrderDetailsScreen (Modal/Stack)
│   │   └── MapViewScreen
│   │
│   ├── Orders Tab
│   │   ├── OrdersListScreen
│   │   │   ├── ActiveOrdersFilter
│   │   │   ├── CompletedOrdersFilter
│   │   │   └── CancelledOrdersFilter
│   │   ├── OrderDetailsScreen
│   │   ├── TrackingMapScreen
│   │   └── RatingScreen
│   │
│   ├── Earnings Tab
│   │   ├── EarningsOverviewScreen
│   │   ├── EarningsDetailsScreen
│   │   ├── PayoutHistoryScreen
│   │   └── BankAccountScreen
│   │
│   └── Profile Tab
│       ├── ProfileScreen
│       ├── EditProfileScreen
│       ├── DocumentsScreen
│       ├── SettingsScreen
│       ├── HelpScreen
│       └── LogoutConfirmation
```

---

## Detailed Screen Breakdown

### 1. AUTH STACK

#### LoginScreen
**File**: `app/auth/login.tsx`

**Components**:
- Logo/Branding
- "Rider Login" header
- Phone number input field (10 digits, country code +91)
- Terms & conditions checkbox
- "Send OTP" button
- "Don't have an account? Sign up" link

**State**:
- `phoneNumber`: string
- `isLoading`: boolean
- `error`: string | null

**Actions**:
- Validate phone number
- Call `/auth/otp/send` endpoint
- Navigate to OTPVerificationScreen

---

#### OTPVerificationScreen
**File**: `app/auth/verify-otp.tsx`

**Components**:
- "Enter OTP" header
- "OTP sent to +91 XXXXXXXXXX" message
- 6-digit OTP input (numeric keypad style)
- "Resend OTP" button (with countdown timer)
- "Verify & Continue" button
- "Change phone number" link

**State**:
- `otp`: string
- `isLoading`: boolean
- `error`: string | null
- `resendCountdown`: number

**Actions**:
- Validate 6-digit OTP
- Call `/auth/otp/verify` endpoint
- Save JWT token to secure storage
- Navigate to ProfileCreationScreen (if new user) or DashboardScreen

---

#### ProfileCreationScreen
**File**: `app/auth/create-profile.tsx`

**Components**:
- "Complete Your Profile" header
- Full name input
- Vehicle type selector (Bike, Scooter, Car)
- Vehicle details input (registration number, model)
- Profile photo upload
- License number input
- "Create Account" button

**State**:
- `fullName`: string
- `vehicleType`: "bike" | "scooter" | "car"
- `vehicleDetails`: object
- `licenseNumber`: string
- `profilePhoto`: image
- `isLoading`: boolean
- `error`: string | null

**Actions**:
- Validate all fields
- Upload profile photo
- Call POST `/auth/profile/create` endpoint
- Navigate to DashboardScreen

---

### 2. MAIN STACK - DASHBOARD TAB

#### DashboardScreen
**File**: `app/(tabs)/dashboard.tsx`

**Components**:
- Header
  - Location display (with address)
  - Settings icon (top right)
- Online/Offline toggle switch
- Today's Statistics Card
  - Total trips completed
  - Total earnings (₹)
  - Average rating (⭐)
  - Cancellation rate (%)
- Current Location Map
  - Current rider position
  - Nearby available orders markers
- Available Orders List
  - Order card (repeating):
    - Pickup location
    - Drop location
    - Estimated distance
    - Estimated time
    - Fare amount
    - "View Details" / "Accept" buttons
- Floating Action Button (FAB) for emergency

**State**:
- `isOnline`: boolean
- `currentLocation`: {lat, lng}
- `availableOrders`: Order[]
- `stats`: {trips, earnings, rating, cancellations}
- `selectedOrder`: Order | null

**Actions**:
- Fetch `/rider/dashboard` endpoint
- Toggle online status
- Accept order → Navigate to OrderDetailsScreen
- Fetch real-time orders via socket.io
- Update location every 10 seconds

---

#### OrderDetailsScreen (Modal from Dashboard)
**File**: `app/(tabs)/dashboard/order-details.tsx`

**Components**:
- Close button (X)
- Order ID
- Order Status Timeline
- Pickup Details
  - Store/Restaurant name
  - Full address
  - Contact number
  - Call button
- Drop Details
  - Customer name
  - Full address
  - Contact number
  - Call button
- Order Items
  - Item list (scrollable)
- Fare Breakdown
  - Subtotal
  - Delivery fee
  - Taxes
  - Total
- Special Instructions (if any)
- "Accept Order" button (primary)
- "Reject Order" button (secondary)

**State**:
- `order`: Order (from navigation params)
- `isLoading`: boolean

**Actions**:
- Accept order → Call `POST /rider/orders/:id/accept`
- Reject order → Call `POST /rider/orders/:id/reject`
- Navigate to OrderDetailsScreen (main tab) on accept
- Close modal

---

#### MapViewScreen
**File**: `app/(tabs)/dashboard/map-view.tsx`

**Components**:
- Full screen map
  - Current rider position (blue marker)
  - Nearby orders (red markers with count)
- Map controls (zoom in/out)
- Bottom sheet showing nearby orders list
- Back button to DashboardScreen

**State**:
- `mapRegion`: MapRegion
- `orders`: Order[]

**Actions**:
- Update map region on location change
- Tap marker → Show order preview

---

### 3. MAIN STACK - ORDERS TAB

#### OrdersListScreen
**File**: `app/(tabs)/orders/index.tsx`

**Components**:
- "Orders" header with filter buttons
  - "Active" filter (default)
  - "Completed" filter
  - "Cancelled" filter
- Active Orders Section
  - Order card (repeating):
    - Order ID
    - Current status badge (Accepted, Pickup, In Transit, Delivered)
    - Pickup location
    - Drop location
    - Customer name
    - ETA
    - Tap → Navigate to OrderDetailsScreen
- Completed Orders Section (Scrollable list)
  - Past order card (repeating):
    - Order ID
    - Completion date/time
    - Earnings
    - Customer rating (if available)
    - Tap → Navigate to OrderDetailsScreen

**State**:
- `orders`: Order[]
- `activeFilter`: "active" | "completed" | "cancelled"
- `isLoading`: boolean
- `refreshing`: boolean

**Actions**:
- Fetch `/rider/orders?status=active` endpoint
- Filter orders by status
- Pull to refresh
- Navigate to OrderDetailsScreen on card tap

---

#### OrderDetailsScreen (Full View)
**File**: `app/(tabs)/orders/[id].tsx`

**Components**:
- Header: "Order Details"
- Order ID & Status Badge
- Status Timeline
  - Accepted ✓
  - Arrived at Pickup (with time) → current step
  - Picked up Items
  - Arrived at Drop
  - Delivered
- Pickup Location Section
  - Store name
  - Full address with map pin
  - Contact info
  - "Call Store" button
  - "Navigate" button (opens maps)
- Picked Items (if applicable)
  - Item count
  - Expandable list
- Drop Location Section
  - Customer name
  - Full address with map pin
  - Contact info
  - "Call Customer" button
  - "Navigate" button
- Special Instructions
- Order Timeline with timestamps
- Fare Details
  - Base fare
  - Distance-based
  - Surge (if applicable)
  - Total earned
- Action Buttons (context-based)
  - "Pick Up Items" (when at pickup location)
  - "Drop Items" (when at drop location)
  - "Mark as Delivered" (final step)
- "View Map" button → Navigate to TrackingMapScreen
- "Rate Order" button (if completed) → Navigate to RatingScreen

**State**:
- `order`: Order
- `currentStep`: OrderStatus
- `isLoading`: boolean

**Actions**:
- Fetch `GET /orders/:id` endpoint
- Update order status via `POST /orders/:id/update-status`
- Subscribe to real-time updates via socket.io
- Navigate to TrackingMapScreen
- Navigate to RatingScreen if completed

---

#### TrackingMapScreen
**File**: `app/(tabs)/orders/[id]/map.tsx`

**Components**:
- Full screen map
  - Pickup location marker (🟢 green)
  - Current rider position (🔵 blue)
  - Drop location marker (🔴 red)
  - Route line connecting all points
- Map controls (zoom, recenter)
- Bottom sheet panel
  - "Pickup" with address & "Call" button
  - Current status message
  - "Drop" with address & "Call" button
  - ETA countdown
- Back button

**State**:
- `mapRegion`: MapRegion
- `riderLocation`: {lat, lng} (updated every 5 seconds)
- `pickupLocation`: {lat, lng}
- `dropLocation`: {lat, lng}

**Actions**:
- Update rider location every 5 seconds
- Center map on rider location
- Fetch order details on mount

---

#### RatingScreen
**File**: `app/(tabs)/orders/[id]/rate.tsx`

**Components**:
- "Rate This Order" header
- Customer/Store name
- Star rating selector (1-5 stars, tap to rate)
- Optional review text input
  - Placeholder: "Any feedback?"
- Comment tags (Pre-defined):
  - "Good behavior"
  - "Clean vehicle"
  - "Quick delivery"
  - "Professional"
  - "Poor experience"
  - etc.
- "Submit Rating" button
- "Skip" button

**State**:
- `rating`: number (1-5)
- `review`: string
- `selectedTags`: string[]
- `isSubmitting`: boolean

**Actions**:
- Submit rating via `POST /orders/:id/rate`
- Navigate back to OrdersListScreen

---

### 4. MAIN STACK - EARNINGS TAB

#### EarningsOverviewScreen
**File**: `app/(tabs)/earnings/index.tsx`

**Components**:
- "Earnings" header
- Total Earnings Card (highlighted)
  - Period selector (Today | This Week | This Month | All Time)
  - ₹ amount in large text
  - Trend indicator (↑/↓ with percentage)
- Quick Stats Grid
  - Card 1: Total Orders (count)
  - Card 2: Average Per Order (₹)
  - Card 3: Bonus/Incentives (₹)
  - Card 4: Deductions (₹)
- Recent Earnings List
  - Earning entry (repeating):
    - Order ID
    - Date & time
    - Amount earned
    - Tap → Navigate to EarningsDetailsScreen
- "View Detailed Analytics" button → Navigate to EarningsDetailsScreen

**State**:
- `earnings`: EarningRecord[]
- `totalEarnings`: number
- `selectedPeriod`: "today" | "week" | "month" | "all"
- `stats`: {totalOrders, avgPerOrder, bonus, deductions}

**Actions**:
- Fetch `GET /rider/earnings?period={period}` endpoint
- Filter by period
- Navigate to EarningsDetailsScreen

---

#### EarningsDetailsScreen
**File**: `app/(tabs)/earnings/details.tsx`

**Components**:
- "Detailed Earnings" header
- Date Range Selector
  - From date picker
  - To date picker
- Earnings Chart (Bar/Line chart)
  - X-axis: Days/Weeks
  - Y-axis: Amount (₹)
- Earnings Breakdown
  - Table/Cards showing:
    - Date
    - Orders count
    - Total earned
    - Bonus
    - Deductions
    - Net amount
- Export Report button (PDF/CSV)

**State**:
- `startDate`: Date
- `endDate`: Date
- `chartData`: ChartDataPoint[]
- `breakdownData`: EarningBreakdown[]

**Actions**:
- Fetch earnings data with date filters
- Generate chart
- Export report

---

#### PayoutHistoryScreen
**File**: `app/(tabs)/earnings/payouts.tsx`

**Components**:
- "Payout History" header
- Next Payout Card
  - Payout date
  - Pending amount
  - "View Details" button
- Payout History List
  - Payout entry (repeating):
    - Payout ID
    - Date & time
    - Amount
    - Status badge (Pending | Completed | Failed)
    - Tap → Show payout details
- "Request Payout" button

**State**:
- `payouts`: Payout[]
- `nextPayout`: Payout | null

**Actions**:
- Fetch `GET /rider/payouts` endpoint
- Navigate to BankAccountScreen on "Request Payout"

---

#### BankAccountScreen
**File**: `app/(tabs)/earnings/bank-account.tsx`

**Components**:
- "Bank Account Details" header
- Account Status (Verified | Pending Verification | Not Set)
- Account Details (if verified)
  - Account holder name
  - Bank name
  - Account number (masked)
  - IFSC code
  - "Edit" button
- Add/Update Account Form
  - Account holder name input
  - Bank name dropdown
  - Account number input
  - IFSC code input
  - Account type (Savings | Current)
  - "Verify Account" button
- Verification Instructions (if pending)

**State**:
- `bankAccount`: BankAccount | null
- `isEditing`: boolean
- `formData`: BankAccountForm
- `isVerifying`: boolean

**Actions**:
- Fetch `GET /rider/bank-account` endpoint
- Submit account details via `POST /rider/bank-account`
- Verify account via `POST /rider/bank-account/verify`

---

### 5. MAIN STACK - PROFILE TAB

#### ProfileScreen
**File**: `app/(tabs)/profile/index.tsx`

**Components**:
- Profile header
  - Profile picture (large)
  - Name
  - Phone number
  - Rating (⭐ stars)
- Profile Statistics
  - Total trips completed
  - Total earnings
  - Total distance traveled
  - Join date
- Menu Items
  - "Edit Profile" → Navigate to EditProfileScreen
  - "Documents" → Navigate to DocumentsScreen
  - "Settings" → Navigate to SettingsScreen
  - "Help & Support" → Navigate to HelpScreen
  - "Logout" → Show confirmation dialog

**State**:
- `profile`: RiderProfile
- `stats`: RiderStats

**Actions**:
- Fetch `GET /auth/profile` endpoint
- Navigate to respective screens
- Show logout confirmation

---

#### EditProfileScreen
**File**: `app/(tabs)/profile/edit.tsx`

**Components**:
- "Edit Profile" header
- Profile picture
  - Change photo button
  - Camera/Gallery picker
- Form fields
  - Full name (editable)
  - Phone number (read-only)
  - Vehicle type (editable)
  - Vehicle details (editable)
  - Bio/About (editable)
- "Save Changes" button
- "Cancel" button

**State**:
- `formData`: ProfileEditForm
- `isLoading`: boolean
- `profilePhoto`: image | null

**Actions**:
- Upload profile photo
- Submit form via `POST /auth/profile/update`
- Navigate back to ProfileScreen

---

#### DocumentsScreen
**File**: `app/(tabs)/profile/documents.tsx`

**Components**:
- "Documents" header
- Driver's License
  - Status badge (Verified | Pending | Expired | Not Uploaded)
  - Expiry date
  - Upload/Update button
  - View button (if uploaded)
- Insurance
  - Status badge
  - Expiry date
  - Upload/Update button
  - View button
- RC (Registration Certificate)
  - Status badge
  - Upload/Update button
  - View button
- Background Check
  - Status badge
  - Last checked date
  - Status details
- Document Upload Modal
  - Camera option
  - Gallery option
  - Document preview
  - Upload button

**State**:
- `documents`: DocumentRecord[]
- `selectedDocument`: DocumentType | null
- `uploadingDocument`: boolean

**Actions**:
- Fetch `GET /rider/documents` endpoint
- Upload document via `POST /rider/documents/{type}`
- View document details

---

#### SettingsScreen
**File**: `app/(tabs)/profile/settings.tsx`

**Components**:
- "Settings" header
- Notification Preferences
  - "Order notifications" toggle
  - "Payment notifications" toggle
  - "Promotional notifications" toggle
- Location Tracking
  - "Always share location during delivery" toggle
  - "Precise location accuracy" toggle
- App Preferences
  - Language selector (English, Hindi, etc.)
  - Dark mode toggle
  - Auto-accept orders toggle (with distance limit)
- Account
  - Change password
  - Two-factor authentication toggle
- About
  - App version
  - Build number
  - Terms of Service link
  - Privacy Policy link

**State**:
- `settings`: SettingsData
- `isSaving`: boolean

**Actions**:
- Update settings via `POST /rider/settings`
- Toggle preferences
- Navigate to external links

---

#### HelpScreen
**File**: `app/(tabs)/profile/help.tsx`

**Components**:
- "Help & Support" header
- Frequently Asked Questions (FAQ)
  - Expandable FAQ items
  - Search FAQs
- Contact Support
  - "Chat with Support" button → Open chat
  - "Call Support" button → Dial support number
  - "Email Support" link
- Report an Issue
  - Issue type dropdown
  - Description input
  - Screenshot upload option
  - "Submit" button
- Documentation links

**State**:
- `faqs`: FAQ[]
- `reportingIssue`: boolean
- `issueForm`: IssueReportForm

**Actions**:
- Fetch FAQs
- Submit issue report
- Open chat/call support

---

## State Management Structure

```typescript
// authStore.ts
{
  user: RiderProfile | null
  token: string | null
  isAuthenticated: boolean
  login: (phone) => Promise
  verifyOTP: (otp) => Promise
  logout: () => Promise
}

// orderStore.ts
{
  availableOrders: Order[]
  activeOrders: Order[]
  completedOrders: Order[]
  currentOrder: Order | null
  acceptOrder: (orderId) => Promise
  updateOrderStatus: (orderId, status) => Promise
  fetchOrders: () => Promise
}

// earningStore.ts
{
  totalEarnings: number
  earnings: EarningRecord[]
  payouts: Payout[]
  bankAccount: BankAccount | null
  fetchEarnings: (period) => Promise
  fetchPayouts: () => Promise
}

// locationStore.ts
{
  currentLocation: Location
  updateLocation: (lat, lng) => void
}
```

---

## API Integration Points

| Screen | Endpoint | Method | Purpose |
|--------|----------|--------|---------|
| LoginScreen | `/auth/otp/send` | POST | Send OTP |
| OTPVerificationScreen | `/auth/otp/verify` | POST | Verify OTP & get token |
| ProfileCreationScreen | `/auth/profile/create` | POST | Create rider profile |
| DashboardScreen | `/rider/dashboard` | GET | Get stats & available orders |
| OrderDetailsScreen | `/orders/:id` | GET | Get order details |
| OrderDetailsScreen | `/orders/:id/update-status` | POST | Update order status |
| TrackingMapScreen | `/orders/:id` | GET | Get real-time order data |
| RatingScreen | `/orders/:id/rate` | POST | Submit rating |
| EarningsOverviewScreen | `/rider/earnings` | GET | Get earnings data |
| EarningsDetailsScreen | `/rider/earnings/detailed` | GET | Get detailed earnings |
| PayoutHistoryScreen | `/rider/payouts` | GET | Get payout history |
| BankAccountScreen | `/rider/bank-account` | GET/POST | Get/Update bank details |
| ProfileScreen | `/auth/profile` | GET | Get profile |
| EditProfileScreen | `/auth/profile/update` | POST | Update profile |
| DocumentsScreen | `/rider/documents` | GET/POST | Get/Upload documents |
| SettingsScreen | `/rider/settings` | POST | Update settings |

---

## Socket.io Events

- `rider:new-order` - New order available
- `rider:order-cancelled` - Order cancelled
- `rider:order-updated` - Order status updated
- `rider:location-update` - Rider location updated
- `rider:notification` - Generic notification
