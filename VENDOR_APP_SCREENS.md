# VENDOR MOBILE APP - Navigation & Screens

## Navigation Structure

```
VendorApp
├── Auth Stack
│   ├── LoginScreen (Email/Phone)
│   ├── PasswordResetScreen
│   └── ForgotPasswordScreen
│
├── Main Stack (Bottom Tabs)
│   ├── Dashboard Tab
│   │   ├── DashboardScreen
│   │   ├── AnalyticsDetailScreen (modal)
│   │   └── NotificationsScreen
│   │
│   ├── Orders Tab
│   │   ├── OrdersListScreen
│   │   ├── OrderDetailsScreen
│   │   ├── KitchenDisplayScreen (KDS)
│   │   └── PrintOrderScreen (modal)
│   │
│   ├── Menu Tab
│   │   ├── MenuListScreen
│   │   ├── MenuItemScreen
│   │   ├── AddEditItemScreen (modal)
│   │   └── BulkActionsScreen (modal)
│   │
│   ├── Analytics Tab
│   │   ├── AnalyticsOverviewScreen
│   │   ├── SalesChartScreen
│   │   ├── CustomerMetricsScreen
│   │   └── ReportsScreen
│   │
│   └── Profile Tab
│       ├── ProfileScreen
│       ├── EditProfileScreen
│       ├── StoreSettingsScreen
│       ├── BankAccountScreen
│       ├── StaffScreen
│       ├── InventoryScreen
│       ├── SupportScreen
│       └── LogoutConfirmation
```

---

## Detailed Screen Breakdown

### 1. AUTH STACK

#### LoginScreen
**File**: `app/auth/login.tsx`

**Components**:
- Logo & branding (larger for vendor)
- "Vendor Login" header
- Email input field
  - Placeholder: "Enter your email"
  - Keyboard: email
- Password input field
  - Placeholder: "Enter your password"
  - Eye icon to toggle visibility
- "Forgot Password?" link → Navigate to ForgotPasswordScreen
- "Login" button (primary)
- Error message display

**State**:
- `email`: string
- `password`: string
- `isLoading`: boolean
- `error`: string | null
- `showPassword`: boolean

**Actions**:
- Validate email & password
- Call `POST /auth/login` endpoint
- Save JWT token to secure storage
- Navigate to DashboardScreen on success

---

#### ForgotPasswordScreen
**File**: `app/auth/forgot-password.tsx`

**Components**:
- "Reset Password" header
- "Enter your email address" subtitle
- Email input field
- "Send Reset Link" button
- "Back to Login" link
- Success message (after submission)
  - "Check your email for reset instructions"

**State**:
- `email`: string
- `isLoading`: boolean
- `error`: string | null
- `isSubmitted`: boolean

**Actions**:
- Validate email
- Call `POST /auth/forgot-password` endpoint
- Show success message

---

#### PasswordResetScreen
**File**: `app/auth/reset-password.tsx`

**Components**:
- "Set New Password" header
- New password input
- Confirm password input
- Password strength indicator
- "Reset Password" button
- Success message
  - Redirect to LoginScreen after 2 seconds

**State**:
- `newPassword`: string
- `confirmPassword`: string
- `isLoading`: boolean
- `error`: string | null
- `passwordStrength`: "weak" | "medium" | "strong"

**Actions**:
- Validate password match
- Call `POST /auth/reset-password` endpoint
- Navigate to LoginScreen

---

### 2. MAIN STACK - DASHBOARD TAB

#### DashboardScreen
**File**: `app/(tabs)/dashboard/index.tsx`

**Components**:
- Header
  - Store name
  - Online/Offline toggle switch
  - Settings icon (top right)
- Business Hours Display
  - "Today's Hours: 10:00 AM - 11:00 PM"
  - Edit button
  - Status badge (Open | Closed | Closing Soon)
- Quick Stats Cards (4 cards in grid, tap for details)
  - Card 1: Today's Orders
    - Number (e.g., "24")
    - Trend indicator (↑ 15% from yesterday)
    - Tap → Navigate to AnalyticsDetailScreen
  - Card 2: Today's Revenue
    - Amount (₹XXXX)
    - Trend indicator
    - Tap → Navigate to AnalyticsDetailScreen
  - Card 3: Active Orders
    - Count (e.g., "3")
    - Tap → Navigate to OrdersListScreen (filter: active)
  - Card 4: Average Rating
    - Rating (⭐ 4.5)
    - Review count
    - Tap → Navigate to ReviewsScreen
- Recent Orders Section
  - "Recent Orders" header with "View All" link
  - Order card (repeating, last 5):
    - Order ID
    - Customer name
    - Order status badge
    - Total amount
    - Time received
    - Status indicator (🟢 accepted, 🟡 preparing, 🔴 delayed)
    - Tap → Navigate to OrderDetailsScreen
- Notifications Bell
  - Badge showing unread count
  - Tap → Navigate to NotificationsScreen
- Quick Action Buttons (bottom sticky)
  - "KDS" button → Navigate to KitchenDisplayScreen
  - "Add Menu Item" button → Navigate to AddEditItemScreen (add mode)

**State**:
- `store`: Store
- `isOnline`: boolean
- `todayStats`: {orders: number, revenue: number, activeOrders: number, avgRating: number}
- `recentOrders`: Order[]
- `trends`: {ordersTrend: number, revenueTrend: number}
- `unreadNotifications`: number
- `isLoading`: boolean

**Actions**:
- Fetch `GET /vendor/dashboard` endpoint
- Toggle online status via `POST /vendor/online-status`
- Subscribe to real-time order updates via socket.io
- Navigate to various screens

---

#### AnalyticsDetailScreen (Modal)
**File**: `app/(tabs)/dashboard/analytics-detail.tsx`

**Components**:
- Close button (X)
- Selected metric title (Orders | Revenue)
- Period selector (Today | Week | Month | Year)
- Chart display
  - Bar chart or line chart
  - X-axis: Days/Dates
  - Y-axis: Values
- Detailed breakdown table
  - Columns: Date, Orders/Revenue, Comparison, Trend
- Export button (CSV/PDF)

**State**:
- `metricType`: "orders" | "revenue"
- `selectedPeriod`: "today" | "week" | "month" | "year"
- `chartData`: DataPoint[]
- `breakdown`: BreakdownItem[]

**Actions**:
- Fetch detailed analytics data
- Generate chart
- Export report

---

#### NotificationsScreen
**File**: `app/(tabs)/dashboard/notifications.tsx`

**Components**:
- "Notifications" header with "Mark all as read" button
- Notification items (reverse chronological)
  - Notification card (repeating):
    - Icon (order, payment, system, etc.)
    - Title
    - Message
    - Timestamp (2 mins ago)
    - Unread indicator (blue dot)
    - Tap → Mark as read & navigate to relevant screen (e.g., OrderDetailsScreen)
- Empty state (if no notifications)

**State**:
- `notifications`: Notification[]
- `unreadCount`: number

**Actions**:
- Fetch `GET /vendor/notifications` endpoint
- Mark notification as read
- Clear all notifications

---

### 3. MAIN STACK - ORDERS TAB

#### OrdersListScreen
**File**: `app/(tabs)/orders/index.tsx`

**Components**:
- "Orders" header with filter button
- Status filter pills (horizontal scroll)
  - "All" pill
  - "Pending" pill (count badge)
  - "Confirmed" pill (count badge)
  - "Preparing" pill (count badge)
  - "Ready" pill (count badge)
  - "Completed" pill (count badge)
  - Tap to filter
- Active Orders Section
  - Order card (repeating):
    - Order ID (e.g., "#ORD123456")
    - Customer name
    - Order items (first 3 items, "+2 more" if more)
    - Total amount
    - Order timestamp
    - Prep time remaining (if applicable)
    - Status badge (color-coded)
    - Quick action buttons:
      - "View" button → Navigate to OrderDetailsScreen
      - "Print" button → Navigate to PrintOrderScreen
    - Long press → Show action menu (accept, reject, complete)
- Empty state (if no orders)

**State**:
- `orders`: Order[]
- `statusFilter`: string
- `isLoading`: boolean
- `refreshing`: boolean

**Actions**:
- Fetch `GET /vendor/orders` endpoint (with status filter)
- Filter orders by status
- Pull to refresh
- Navigate to OrderDetailsScreen
- Update order status
- Subscribe to real-time new orders

---

#### OrderDetailsScreen
**File**: `app/(tabs)/orders/[id].tsx`

**Components**:
- Header: Order ID & Status Badge
- Order Timeline
  - "Order Placed" (timestamp) ✓
  - "Confirmed" (timestamp) → current step
  - "Preparing" (estimated time)
  - "Ready for Pickup" (estimated time)
  - "Delivered" (if completed)
- Customer Information
  - Customer name & phone
  - "Call Customer" button
  - "Chat" button (if messaging enabled)
- Delivery/Pickup Information
  - Address
  - Delivery type (Dine-in | Takeaway | Delivery)
  - Delivery instructions (if any)
- Order Items
  - Item list (expandable):
    - Item name
    - Quantity
    - Special instructions/customizations
    - Cooking time (if applicable)
    - Status indicator (pending | cooking | ready)
- Charges Summary
  - Subtotal: ₹XXX
  - Service charge: ₹XX
  - Tax: ₹XX
  - Total: ₹XXX
  - Payment method
- Action Buttons (context-based)
  - "Confirm Order" button (if pending)
  - "Start Preparing" button (if confirmed)
  - "Mark as Ready" button (if preparing)
  - "Mark as Completed" button (if ready)
  - "Print Order" button → Navigate to PrintOrderScreen
  - "Reject Order" button (with reason) → Show modal
- Notes Section
  - Vendor notes (if any)
  - Add/Edit notes button

**State**:
- `orderId`: string
- `order`: Order
- `isLoading`: boolean
- `isUpdating`: boolean

**Actions**:
- Fetch `GET /vendor/orders/:id` endpoint
- Update order status via `POST /vendor/orders/:id/status`
- Subscribe to real-time updates
- Print order
- Add notes

---

#### KitchenDisplayScreen (KDS)
**File**: `app/(tabs)/orders/kds.tsx`

**Components**:
- Full-screen kitchen display interface
- Order cards arranged by status (columns)
  - Column 1: "New Orders" (Red)
  - Column 2: "Preparing" (Yellow)
  - Column 3: "Ready" (Green)
- Order card (in columns)
  - Order ID (large)
  - Items list
    - Item name
    - Quantity
    - Special instructions
    - Status indicator
  - Order received time
  - Total items count
  - Estimated prep time
  - Tap to move to next column
  - Long press to show options (print, reject, etc.)
- Timer for each order (countdown)
- New order alert (sound/visual)
- Print button (hardware printer)
- Filters (dine-in, takeaway, delivery)
- Settings button (adjust timer, sound, etc.)

**State**:
- `orders`: Order[] (organized by status columns)
- `selectedFilter`: "all" | "dine-in" | "takeaway" | "delivery"
- `soundEnabled`: boolean
- `timerSettings`: TimerSettings

**Actions**:
- Fetch `GET /vendor/orders` endpoint (filter: active)
- Subscribe to real-time order updates via socket.io
- Move order between columns via `POST /vendor/orders/:id/status`
- Print order receipt
- Play sound on new order

---

#### PrintOrderScreen (Modal)
**File**: `app/(tabs)/orders/[id]/print.tsx`

**Components**:
- Print preview pane
  - Order ID & date/time
  - Customer name
  - Items list with quantities
  - Delivery address (if applicable)
  - Special instructions
  - Payment details
  - QR code (order tracking)
- "Print" button (opens system print dialog)
- "Share" button (WhatsApp, Email)
- "Close" button

**State**:
- `orderId`: string
- `order`: Order
- `printFormat`: "receipt" | "label" | "kitchen-ticket"

**Actions**:
- Print via native print functionality
- Share print preview

---

### 4. MAIN STACK - MENU TAB

#### MenuListScreen
**File**: `app/(tabs)/menu/index.tsx`

**Components**:
- "Menu" header with "Add Item" button
- Category list (vertical scroll with sticky category headers)
  - Category header
    - Category name
    - Edit category button
    - Number of items in category
  - Menu items under category
    - Item card (repeating):
      - Item image (small)
      - Item name
      - Item description (1 line, truncated)
      - Price (₹XXX)
      - Availability toggle (if available)
      - Edit button
      - Delete button
      - Long press → Show bulk action menu
- Bulk Actions Button (bottom sticky)
  - "Bulk Actions" button → Navigate to BulkActionsScreen
- Search bar (search items by name)
- Add New Category Button

**State**:
- `menuItems`: MenuItem[] (organized by category)
- `categories`: Category[]
- `searchQuery`: string
- `isLoading`: boolean

**Actions**:
- Fetch `GET /vendor/menu` endpoint
- Search menu items
- Navigate to AddEditItemScreen (add/edit mode)
- Toggle item availability via `POST /vendor/menu/:id/availability`
- Delete item via `DELETE /vendor/menu/:id`
- Navigate to BulkActionsScreen

---

#### MenuItemScreen
**File**: `app/(tabs)/menu/[id].tsx`

**Components**:
- Header: Item name
- Item image (large)
- Item details
  - Category tag
  - Price (₹XXX)
  - Description
  - Availability status
- Customization Options (if applicable)
  - Option 1: Size (S, M, L, XL)
  - Option 2: Add-ons (checkboxes with prices)
- Rating & Reviews (if available)
  - Average rating (⭐ 4.5)
  - Recent reviews (3)
  - "View All Reviews" link
- Action Buttons
  - "Edit" button → Navigate to AddEditItemScreen
  - "Duplicate" button (creates copy)
  - "Delete" button (with confirmation)
  - "Toggle Availability" button

**State**:
- `itemId`: string
- `item`: MenuItem
- `isLoading`: boolean

**Actions**:
- Fetch `GET /vendor/menu/:id` endpoint
- Navigate to AddEditItemScreen for editing
- Delete or duplicate item
- Toggle availability

---

#### AddEditItemScreen (Modal)
**File**: `app/(tabs)/menu/add-edit.tsx`

**Components**:
- "Add Menu Item" or "Edit Item" header
- Item image upload
  - Tap to camera/gallery
  - Image preview
- Item details form
  - Item name input (required)
  - Category dropdown
  - Price input (₹)
  - Description textarea (max 200 chars)
  - Availability toggle
  - Preparation time slider (minutes)
  - Spice level indicator (mild, medium, hot, extra hot)
- Customization Options
  - "Add Customization" button
  - Customization item (repeating):
    - Option name (e.g., "Size")
    - Option type (select | checkbox)
    - Option values (repeating):
      - Value name (e.g., "Small")
      - Price modifier (₹0, ₹50, etc.)
      - Delete button
    - Delete customization button
- SEO/Visibility Settings (optional)
  - Visibility toggle (show/hide from menu)
  - Tags input
- "Save Item" button
- "Cancel" button

**State**:
- `formData`: MenuItemForm
- `image`: image | null
- `customizations`: Customization[]
- `isLoading`: boolean
- `error`: string | null

**Actions**:
- Upload item image
- Save item via `POST /vendor/menu` or `PUT /vendor/menu/:id` endpoint
- Navigate back to MenuListScreen

---

#### BulkActionsScreen (Modal)
**File**: `app/(tabs)/menu/bulk-actions.tsx`

**Components**:
- "Bulk Actions" header
- Select items section
  - "Select All" checkbox
  - Item checkbox list (all items)
    - Item name (repeating)
    - Checkbox
  - Selected count: "X items selected"
- Action buttons
  - "Enable Availability" button
  - "Disable Availability" button
  - "Delete Selected" button (with confirmation)
  - "Export Selected" button (CSV)
- Status message

**State**:
- `selectedItems`: string[] (item IDs)
- `allItems`: MenuItem[]

**Actions**:
- Update availability for multiple items via `POST /vendor/menu/bulk-update`
- Delete multiple items via `POST /vendor/menu/bulk-delete`
- Export menu

---

### 5. MAIN STACK - ANALYTICS TAB

#### AnalyticsOverviewScreen
**File**: `app/(tabs)/analytics/index.tsx`

**Components**:
- "Analytics" header with period selector (Today | Week | Month | Year)
- Key Metrics Cards (4 cards)
  - Card 1: Total Orders
    - Count with trend (↑/↓)
    - Tap → Navigate to SalesChartScreen
  - Card 2: Total Revenue
    - Amount with trend
    - Tap → Navigate to SalesChartScreen
  - Card 3: Average Order Value
    - Amount with trend
    - Tap → Navigate to SalesChartScreen
  - Card 4: Customer Satisfaction
    - Rating (⭐)
    - Review count
    - Tap → Navigate to CustomerMetricsScreen
- Sales Overview Chart
  - Line chart showing orders/revenue over time
  - Touch interactions (tap to see exact value)
- Top Selling Items
  - "Top Selling Items" header
  - Item card (repeating, top 5):
    - Item name
    - Units sold
    - Revenue generated
    - Growth indicator
- Recent Transactions
  - Transaction item (repeating):
    - Description
    - Amount
    - Timestamp

**State**:
- `selectedPeriod`: "today" | "week" | "month" | "year"
- `metrics`: {orders: number, revenue: number, avgOrderValue: number, satisfaction: number}
- `trends`: {ordersTrend: number, revenueTrend: number, aoTrend: number, satisfactionTrend: number}
- `chartData`: DataPoint[]
- `topItems`: TopItem[]
- `isLoading`: boolean

**Actions**:
- Fetch `GET /vendor/analytics` endpoint
- Change period selector
- Navigate to detailed screens

---

#### SalesChartScreen
**File**: `app/(tabs)/analytics/sales-chart.tsx`

**Components**:
- "Sales Analytics" header
- Chart type selector (Line | Bar | Pie)
- Chart display (large, interactive)
  - X-axis: Dates
  - Y-axis: Orders/Revenue
- Metrics selector toggle (Orders | Revenue | Both)
- Time period selector (Day | Week | Month | Year)
- Detailed table below chart
  - Columns: Date, Orders, Revenue, Avg Order Value, Trend
  - Sortable columns
  - Pagination
- Export button (CSV/PDF)

**State**:
- `chartType`: "line" | "bar" | "pie"
- `metricsType`: "orders" | "revenue" | "both"
- `timePeriod`: "day" | "week" | "month" | "year"
- `chartData`: DataPoint[]
- `tableData`: TableRow[]

**Actions**:
- Fetch detailed chart data
- Switch chart types & metrics
- Export data

---

#### CustomerMetricsScreen
**File**: `app/(tabs)/analytics/customers.tsx`

**Components**:
- "Customer Metrics" header
- Key Metrics Cards
  - New Customers (today/week/month)
  - Returning Customers (percentage)
  - Average Customer Rating
  - Customer Retention Rate
- Customer Growth Chart
  - Line chart showing new vs returning customers
- Customer Satisfaction Breakdown
  - Rating distribution (1⭐ to 5⭐)
  - Pie chart showing percentage for each rating
- Top Reviews
  - 5-star reviews (count)
  - Review card (repeating, recent positive reviews):
    - Customer name
    - Rating
    - Review text
    - Date posted
  - 1-star reviews (count)
  - Review card (repeating, recent negative reviews):
    - Customer name
    - Rating
    - Review text
    - Date posted
    - "Reply" button

**State**:
- `selectedPeriod`: "today" | "week" | "month"
- `metrics`: CustomerMetrics
- `chartData`: DataPoint[]
- `reviews`: Review[]
- `topReviews`: Review[]
- `lowReviews`: Review[]

**Actions**:
- Fetch customer metrics data
- Reply to reviews via `POST /vendor/reviews/:id/reply` endpoint

---

#### ReportsScreen
**File**: `app/(tabs)/analytics/reports.tsx`

**Components**:
- "Reports" header
- Predefined Reports
  - "Daily Sales Report" → Generate & download
  - "Weekly Performance Report" → Generate & download
  - "Monthly Summary Report" → Generate & download
  - "Inventory Report" → Generate & download
  - "Staff Performance Report" → Generate & download
- Custom Report Builder
  - Metrics selector (checkboxes)
    - Orders
    - Revenue
    - Customers
    - Ratings
  - Date range picker
  - Format selector (PDF, CSV, Excel)
  - "Generate Report" button
- Recent Reports List
  - Report item (repeating):
    - Report name & type
    - Generated date
    - Download button
    - Delete button

**State**:
- `reports`: Report[]
- `selectedMetrics`: string[]
- `dateRange`: {from: Date, to: Date}
- `format`: "pdf" | "csv" | "excel"
- `isGenerating`: boolean

**Actions**:
- Generate predefined reports
- Generate custom reports
- Download report
- Delete report

---

### 6. MAIN STACK - PROFILE TAB

#### ProfileScreen
**File**: `app/(tabs)/profile/index.tsx`

**Components**:
- Profile header
  - Store image/logo
  - Store name
  - Category tag
  - Rating (⭐)
  - Edit button → Navigate to EditProfileScreen
- Store Statistics
  - Joined date
  - Total orders served
  - Total customers
  - Average rating
- Menu Items
  - "Store Settings" → Navigate to StoreSettingsScreen
  - "Bank Account" → Navigate to BankAccountScreen
  - "Staff Management" → Navigate to StaffScreen
  - "Inventory" → Navigate to InventoryScreen
  - "Support" → Navigate to SupportScreen
  - "Logout" → Show confirmation

**State**:
- `store`: Store
- `stats`: StoreStats

**Actions**:
- Fetch `GET /vendor/profile` endpoint
- Navigate to respective screens
- Show logout confirmation

---

#### EditProfileScreen
**File**: `app/(tabs)/profile/edit.tsx`

**Components**:
- "Edit Store Profile" header
- Store logo/image
  - Change photo button
  - Camera/Gallery picker
- Form fields
  - Store name (editable)
  - Category (editable dropdown)
  - Phone number (editable)
  - Email (editable)
  - Bio/Description (editable textarea)
  - Cuisine types (multi-select tags)
  - Average prep time (number input)
- "Save Changes" button
- "Cancel" button

**State**:
- `formData`: StoreProfileForm
- `storeImage`: image | null
- `isLoading`: boolean
- `error`: string | null

**Actions**:
- Upload store image
- Submit form via `POST /vendor/profile/update` endpoint
- Navigate back to ProfileScreen

---

#### StoreSettingsScreen
**File**: `app/(tabs)/profile/settings.tsx`

**Components**:
- "Store Settings" header
- Business Hours
  - Day selector (Monday-Sunday)
  - Time pickers (open, close)
  - "Off" toggle for closed days
  - "Save Hours" button
- Delivery Settings
  - Delivery radius (kilometers, slider)
  - Min order amount (₹)
  - Delivery fee (₹)
  - Free delivery threshold (₹)
  - Apply to all categories toggle
- Advance Order Settings
  - "Accept advance orders" toggle
  - Advance order time limit (days)
- Payment Settings
  - Payment methods (toggles)
    - Credit/Debit Card
    - UPI
    - Wallet
    - Cash on Delivery
- Restaurant Type
  - Type selector (Restaurant | Bakery | Cafe | etc.)
  - Dine-in available toggle
  - Takeaway available toggle
  - Delivery available toggle
- Special Offers
  - Promotional banner upload
  - Offer details input
  - Active/Inactive toggle
- "Save Settings" button

**State**:
- `businessHours`: BusinessHour[]
- `deliverySettings`: DeliverySettings
- `paymentSettings`: PaymentSettings
- `restaurantType`: string
- `specialOffers`: Offer[]
- `isLoading`: boolean

**Actions**:
- Fetch store settings
- Update settings via `POST /vendor/settings` endpoint

---

#### BankAccountScreen
**File**: `app/(tabs)/profile/bank-account.tsx`

**Components**:
- "Bank Account Details" header
- Account Status
  - Status badge (Verified | Pending | Not Set)
- Account Information (if verified)
  - Account holder name (read-only)
  - Bank name (read-only)
  - Account number (masked, read-only)
  - IFSC code (read-only)
  - "Edit" button
- Add/Update Form
  - Account holder name input
  - Bank name dropdown
  - Account number input
  - IFSC code input
  - Account type (Savings | Current)
  - "Verify Account" button
- Payout History
  - Payout item (repeating):
    - Date
    - Amount
    - Status (Pending | Completed | Failed)
    - Details button
- Payout Settings
  - Auto-payout toggle
  - Payout frequency dropdown (Daily | Weekly | Monthly)
  - Minimum payout amount (₹)

**State**:
- `bankAccount`: BankAccount | null
- `isEditing`: boolean
- `formData`: BankAccountForm
- `payoutHistory`: Payout[]
- `isLoading`: boolean

**Actions**:
- Fetch bank account details
- Submit/update account via `POST /vendor/bank-account` endpoint
- Verify account
- Fetch payout history

---

#### StaffScreen
**File**: `app/(tabs)/profile/staff.tsx`

**Components**:
- "Staff Management" header with "Add Staff" button
- Staff list
  - Staff card (repeating):
    - Name
    - Role (Manager | Chef | Server | Delivery)
    - Phone number
    - Email
    - Joining date
    - Status (Active | Inactive)
    - Edit button
    - Delete button
    - Tap → Show staff details
- Add New Staff Modal
  - Name input
  - Role selector dropdown
  - Phone input
  - Email input
  - Shift assignment (if applicable)
  - "Add Staff" button

**State**:
- `staff`: StaffMember[]
- `showAddModal`: boolean
- `formData`: StaffForm
- `isLoading`: boolean

**Actions**:
- Fetch `GET /vendor/staff` endpoint
- Add staff via `POST /vendor/staff` endpoint
- Update staff via `PUT /vendor/staff/:id` endpoint
- Delete staff via `DELETE /vendor/staff/:id` endpoint

---

#### InventoryScreen
**File**: `app/(tabs)/profile/inventory.tsx`

**Components**:
- "Inventory" header with "Add Item" button
- Inventory list (search enabled)
  - Inventory item (repeating):
    - Item name
    - Current stock (quantity)
    - Reorder level
    - Status indicator (🟢 sufficient, 🟡 low, 🔴 out of stock)
    - Last updated date
    - Edit button
    - Delete button
- Low Stock Alerts
  - Alert item (repeating):
    - Item name
    - Current stock
    - Reorder level
    - "Order Now" button
- Add/Edit Inventory Modal
  - Item name input
  - Quantity input
  - Unit selector (KG, L, pieces, etc.)
  - Reorder level input
  - Supplier name input
  - Supplier contact input
  - Cost input (₹)
  - "Save Item" button

**State**:
- `inventory`: InventoryItem[]
- `lowStockAlerts`: InventoryItem[]
- `searchQuery`: string
- `showAddModal`: boolean
- `isLoading`: boolean

**Actions**:
- Fetch `GET /vendor/inventory` endpoint
- Add inventory item via `POST /vendor/inventory` endpoint
- Update quantity via `POST /vendor/inventory/:id/update` endpoint
- Delete item via `DELETE /vendor/inventory/:id` endpoint

---

#### SupportScreen
**File**: `app/(tabs)/profile/support.tsx`

**Components**:
- "Support" header
- Contact Support Section
  - "Chat with Us" button → Open chat interface
  - "Call Support" button → Dial support number
  - Support hours display
  - "Email Us" link
- FAQs
  - FAQ item (repeating, accordion):
    - Question
    - Expandable answer
- Common Issues
  - Issue type pills
    - "Order Issues"
    - "Technical Support"
    - "Payment Issues"
    - "Other"
- Report Issue Button
  - Opens modal:
    - Issue type dropdown
    - Description textarea
    - Screenshot upload (optional)
    - "Submit" button

**State**:
- `faqs`: FAQ[]
- `expandedFAQId`: string | null
- `showChatInterface`: boolean
- `showIssueModal`: boolean

**Actions**:
- Fetch FAQs
- Open chat/call support
- Submit issue report

---

## State Management Structure

```typescript
// authStore.ts
{
  user: VendorProfile | null
  token: string | null
  isAuthenticated: boolean
  login: (email, password) => Promise
  logout: () => Promise
}

// orderStore.ts
{
  orders: Order[]
  activeOrders: Order[]
  completedOrders: Order[]
  selectedOrder: Order | null
  fetchOrders: (status?) => Promise
  updateOrderStatus: (id, status) => Promise
}

// menuStore.ts
{
  menuItems: MenuItem[]
  categories: Category[]
  fetchMenu: () => Promise
  addMenuItem: (item) => Promise
  updateMenuItem: (id, item) => Promise
  deleteMenuItem: (id) => Promise
}

// analyticsStore.ts
{
  metrics: Metrics
  chartData: DataPoint[]
  topItems: TopItem[]
  fetchAnalytics: (period) => Promise
}

// storeStore.ts
{
  store: Store
  isOnline: boolean
  settings: StoreSettings
  fetchStore: () => Promise
  toggleOnlineStatus: () => Promise
}

// notificationStore.ts
{
  notifications: Notification[]
  unreadCount: number
  fetchNotifications: () => Promise
  markAsRead: (id) => void
}
```

---

## API Integration Points Summary

| Screen | Endpoint | Method | Purpose |
|--------|----------|--------|---------|
| LoginScreen | `/auth/login` | POST | Vendor login |
| DashboardScreen | `/vendor/dashboard` | GET | Get dashboard metrics |
| OrdersListScreen | `/vendor/orders` | GET | Get all orders |
| OrderDetailsScreen | `/vendor/orders/:id` | GET | Get order details |
| OrderDetailsScreen | `/vendor/orders/:id/status` | POST | Update order status |
| KitchenDisplayScreen | `/vendor/orders` | GET | Get active orders |
| MenuListScreen | `/vendor/menu` | GET | Get menu items |
| AddEditItemScreen | `/vendor/menu` | POST/PUT | Save menu item |
| MenuListScreen | `/vendor/menu/:id` | DELETE | Delete menu item |
| AnalyticsOverviewScreen | `/vendor/analytics` | GET | Get analytics data |
| SalesChartScreen | `/vendor/analytics/sales` | GET | Get sales chart data |
| CustomerMetricsScreen | `/vendor/analytics/customers` | GET | Get customer metrics |
| ReportsScreen | `/vendor/reports/generate` | POST | Generate report |
| EditProfileScreen | `/vendor/profile/update` | POST | Update store profile |
| StoreSettingsScreen | `/vendor/settings` | GET/POST | Get/Update settings |
| BankAccountScreen | `/vendor/bank-account` | GET/POST | Manage bank account |
| BankAccountScreen | `/vendor/payouts` | GET | Get payout history |
| StaffScreen | `/vendor/staff` | GET/POST/DELETE | Manage staff |
| InventoryScreen | `/vendor/inventory` | GET/POST/DELETE | Manage inventory |

---

## Socket.io Events

- `vendor:new-order` - New order received
- `vendor:order-updated` - Order status updated by user/system
- `vendor:order-accepted` - Order accepted notification
- `vendor:order-rejected` - Order rejected notification
- `vendor:notification` - Generic notification
- `vendor:online-status-changed` - Store online status changed by other devices
