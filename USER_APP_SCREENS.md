# USER/CUSTOMER MOBILE APP - Navigation & Screens

## Navigation Structure

```
UserApp
├── Auth Stack
│   ├── LoginScreen (Phone Number Input)
│   ├── OTPVerificationScreen
│   └── ProfileCreationScreen
│
├── Main Stack (Bottom Tabs)
│   ├── Home Tab
│   │   ├── HomeScreen
│   │   ├── CategoryScreen (modal)
│   │   └── StoreDetailsScreen
│   │
│   ├── Search Tab
│   │   ├── SearchScreen
│   │   ├── SearchResultsScreen
│   │   └── FilterScreen (modal)
│   │
│   ├── Orders Tab
│   │   ├── OrdersListScreen
│   │   ├── OrderDetailsScreen
│   │   ├── TrackingScreen
│   │   └── RatingScreen
│   │
│   ├── Cart Tab
│   │   ├── CartScreen
│   │   ├── CheckoutScreen
│   │   │   ├── AddressSelectionScreen
│   │   │   ├── DeliveryOptionsScreen
│   │   │   ├── PaymentScreen
│   │   │   └── OrderConfirmationScreen
│   │   └── EmptyCartScreen
│   │
│   └── Profile Tab
│       ├── ProfileScreen
│       ├── EditProfileScreen
│       ├── AddressesScreen
│       │   ├── AddressListScreen
│       │   └── AddEditAddressScreen
│       ├── PaymentMethodsScreen
│       ├── FavoritesScreen
│       ├── WalletScreen
│       ├── LoyaltyScreen
│       ├── ReferralScreen
│       ├── SettingsScreen
│       └── SupportScreen
```

---

## Detailed Screen Breakdown

### 1. AUTH STACK

#### LoginScreen
**File**: `app/auth/login.tsx`

**Components**:
- Logo & branding
- "Welcome to Drop" header
- "Order from your favorite restaurants & stores" tagline
- Phone number input (country code +91 pre-filled)
- Terms & conditions checkbox
- "Send OTP" button
- "Continue as Guest" link (optional)

**State**:
- `phoneNumber`: string
- `isLoading`: boolean
- `error`: string | null

**Actions**:
- Validate phone number
- Call `POST /auth/otp/send` endpoint
- Navigate to OTPVerificationScreen

---

#### OTPVerificationScreen
**File**: `app/auth/verify-otp.tsx`

**Components**:
- "Verify OTP" header
- Phone number display with "Change" link
- 6-digit OTP input field
- "Resend OTP" button with countdown timer (format: "Resend in 30s")
- "Verify & Continue" button
- Help text: "Enter the 6-digit code sent to your phone"

**State**:
- `otp`: string
- `isLoading`: boolean
- `error`: string | null
- `resendCountdown`: number
- `phoneNumber`: string (from navigation params)

**Actions**:
- Validate OTP format
- Call `POST /auth/otp/verify` endpoint
- Save JWT token to secure storage
- Navigate to ProfileCreationScreen (new user) or HomeScreen (existing user)

---

#### ProfileCreationScreen
**File**: `app/auth/create-profile.tsx`

**Components**:
- "Create Your Profile" header
- Profile picture upload (tap to camera/gallery)
- Full name input
- Email input (optional)
- Date of birth picker
- "Create Account" button
- "Skip for Now" option

**State**:
- `fullName`: string
- `email`: string
- `dateOfBirth`: Date | null
- `profilePhoto`: image | null
- `isLoading`: boolean
- `error`: string | null

**Actions**:
- Upload profile photo
- Validate fields
- Call `POST /user/profile/create` endpoint
- Navigate to HomeScreen

---

### 2. MAIN STACK - HOME TAB

#### HomeScreen
**File**: `app/(tabs)/home/index.tsx`

**Components**:
- Header Section
  - Location selector (with map icon)
  - "Deliver to: [Address]" with dropdown
- Search bar
  - "Search restaurants, dishes..." placeholder
  - Tap → Navigate to SearchScreen
- Promotional Banners
  - Carousel/Slider of promotional images
  - "Swipe to explore offers"
- Categories Row (Horizontal Scroll)
  - Category 1: "Restaurants" (icon + text)
  - Category 2: "Grocery" (icon + text)
  - Category 3: "Wine" (icon + text)
  - Category 4: "Genie" (icon + text)
  - Category 5: "Hyperlocal" (icon + text)
  - Tap any → Navigate to CategoryScreen
- Featured Stores Section
  - Store card (repeating):
    - Store image (top)
    - Store name
    - Category tag
    - Rating (⭐ 4.5)
    - Delivery time ("30 mins")
    - Distance ("2 km away")
    - "Promoted" badge (if applicable)
    - Tap → Navigate to StoreDetailsScreen
- "View All" link under Featured Stores
- Bottom padding for tab bar

**State**:
- `selectedLocation`: Address
- `categories`: Category[]
- `featuredStores`: Store[]
- `banners`: Promotion[]
- `isLoading`: boolean

**Actions**:
- Fetch `GET /products/featured-stores` endpoint
- Fetch `GET /products/banners` endpoint
- Fetch categories on mount
- Subscribe to location changes
- Navigate to SearchScreen on search bar tap
- Navigate to CategoryScreen on category tap
- Navigate to StoreDetailsScreen on store card tap

---

#### CategoryScreen (Modal)
**File**: `app/(tabs)/home/category/[id].tsx`

**Components**:
- Header with back button
- Category name & icon
- Filter button → Navigate to FilterScreen
- Sort dropdown (Rating | Distance | Delivery Time | New)
- Stores list (infinite scroll)
  - Store card (repeating):
    - Store image
    - Store name
    - Category tags
    - Rating with count (e.g., "4.5 ⭐ (245 reviews)")
    - Delivery time & distance
    - Tap → Navigate to StoreDetailsScreen
- Loading state & pagination

**State**:
- `categoryId`: string
- `stores`: Store[]
- `filters`: Filter[]
- `sortBy`: "rating" | "distance" | "delivery_time" | "new"
- `isLoading`: boolean
- `page`: number
- `hasMore`: boolean

**Actions**:
- Fetch `GET /products/stores?category={categoryId}` endpoint
- Apply filters & sorting
- Paginate on scroll
- Navigate to StoreDetailsScreen on store tap

---

#### StoreDetailsScreen
**File**: `app/(tabs)/home/store/[id].tsx`

**Components**:
- Header Image (parallax scroll optional)
  - Store image
  - Back button (overlay)
  - Share button (overlay)
  - Favorite button (heart icon, toggleable)
- Store Info Section
  - Store name
  - Rating (⭐ 4.5 with count)
  - Category tags
  - Delivery time
  - Distance
  - Delivery fee (₹50)
  - Minimum order (₹300)
  - Open/Closed status
  - Offers badge (if applicable) "20% off"
- Search bar (search menu items)
- Menu Categories (Horizontal scroll)
  - Category 1: "All Items"
  - Category 2: "Appetizers"
  - Category 3: "Main Course"
  - etc.
  - Tap → Scroll to that section
- Menu Items Section
  - Item card (repeating):
    - Item image (small)
    - Item name
    - Description (truncated)
    - Price
    - Rating badge (if available)
    - Customization indicator (if has options)
    - "Add to Cart" button (+ icon)
    - Tap → Navigate to ProductDetailsScreen (modal)
- Reviews Section
  - "View All Reviews" link
  - Review cards (3 most recent):
    - Customer name & rating (⭐)
    - Review text
    - Date posted
  - Tap "View All Reviews" → Navigate to ReviewsScreen
- Floating "Cart" button (shows item count)

**State**:
- `storeId`: string
- `store`: Store
- `menuItems`: MenuItem[]
- `selectedCategory`: string
- `searchQuery`: string
- `isLoading`: boolean
- `cartCount`: number
- `isFavorite`: boolean

**Actions**:
- Fetch `GET /products/store/:id` endpoint
- Fetch `GET /products/store/:id/menu` endpoint
- Filter menu by search query & category
- Toggle favorite via `POST /user/favorites/toggle`
- Navigate to ProductDetailsScreen on item tap
- Update cart count from cart store

---

### 3. MAIN STACK - SEARCH TAB

#### SearchScreen
**File**: `app/(tabs)/search/index.tsx`

**Components**:
- Search bar (auto-focus)
  - Placeholder: "Search restaurants, dishes..."
  - Clear button (X)
- Recent Searches Section
  - Recent search chips (repeating):
    - "Biryani" chip (tap → search again)
    - "Pizza" chip
    - etc.
  - "Clear all" link
- Trending Section
  - "Trending Now" header
  - Trending item cards:
    - Item name
    - Category
    - Search count indicator
    - Tap → Search and navigate to SearchResultsScreen
- Suggested Categories
  - Category chips (scrollable):
    - "Italian"
    - "Chinese"
    - "Fast Food"
    - etc.
    - Tap → Perform search

**State**:
- `searchQuery`: string
- `recentSearches`: string[]
- `trending`: TrendingItem[]
- `suggestedCategories`: Category[]

**Actions**:
- Fetch `GET /search/recent` endpoint on mount
- Fetch `GET /search/trending` endpoint on mount
- On search input change → Debounce 300ms
- Submit search → Navigate to SearchResultsScreen with query
- Clear search history via `POST /user/search/clear`

---

#### SearchResultsScreen
**File**: `app/(tabs)/search/results.tsx`

**Components**:
- Header with search bar (showing current query)
- Filter button → Navigate to FilterScreen
- Results tabs
  - "Restaurants" tab (count)
  - "Dishes" tab (count)
  - "Products" tab (count)
  - Active tab content displayed below
- Restaurants Tab Content
  - Store cards (repeating):
    - Store image
    - Store name
    - Rating & reviews count
    - Delivery time & distance
    - Delivery fee
    - Tap → Navigate to StoreDetailsScreen
- Dishes Tab Content
  - Dish card (repeating):
    - Dish image
    - Dish name
    - Store name (small text)
    - Price
    - Rating
    - "Add to Cart" button
    - Tap card → Navigate to ProductDetailsScreen
- Products Tab Content
  - Product cards (grid layout)
    - Product image
    - Product name
    - Store name
    - Price
    - "Add to Cart" button
- Pagination / Infinite scroll
- Empty state (if no results)

**State**:
- `searchQuery`: string
- `activeTab`: "restaurants" | "dishes" | "products"
- `results`: {restaurants: [], dishes: [], products: []}
- `filters`: Filter[]
- `isLoading`: boolean
- `page`: number

**Actions**:
- Fetch `GET /search?q={query}&type={type}` endpoint
- Apply filters
- Paginate on scroll
- Navigate to StoreDetailsScreen on restaurant tap
- Navigate to ProductDetailsScreen on dish/product tap

---

#### FilterScreen (Modal)
**File**: `app/(tabs)/search/filter.tsx`

**Components**:
- "Filter" header with close (X) button
- Filter sections (accordion style)
  - Ratings
    - Checkbox: "4.5+ stars"
    - Checkbox: "4+ stars"
    - Checkbox: "3.5+ stars"
  - Delivery Time
    - Checkbox: "30 mins or less"
    - Checkbox: "Under 1 hour"
  - Delivery Fee
    - Slider: 0 - ₹100+
  - Price Range
    - Slider: 0 - ₹5000+
  - Offers
    - Checkbox: "50% off & above"
    - Checkbox: "Flat ₹X off"
    - Checkbox: "Free delivery"
- "Apply Filters" button
- "Clear All" button

**State**:
- `filters`: {ratings: [], deliveryTime: [], deliveryFee: [min, max], price: [min, max], offers: []}
- `isLoading`: boolean

**Actions**:
- Save selected filters to state
- Navigate back with filter results

---

### 4. MAIN STACK - ORDERS TAB

#### OrdersListScreen
**File**: `app/(tabs)/orders/index.tsx`

**Components**:
- "Orders" header
- Status filter tabs
  - "Active" tab
  - "Past Orders" tab
- Active Orders Section
  - Order card (repeating):
    - Order ID
    - Store name
    - Order status badge (Confirmed | Preparing | On the Way | Delivered)
    - Order items (first 2 items, "...+2 more" if more)
    - Order total
    - Estimated delivery time
    - "Track Order" button
    - Tap card → Navigate to OrderDetailsScreen
- Past Orders Section
  - Order card (repeating):
    - Store name
    - Date & time
    - Order total
    - "Rate" button (if not rated)
    - "Reorder" button
    - Tap card → Navigate to OrderDetailsScreen

**State**:
- `activeOrders`: Order[]
- `pastOrders`: Order[]
- `activeTab`: "active" | "past"
- `isLoading`: boolean

**Actions**:
- Fetch `GET /orders?status=active` endpoint
- Fetch `GET /orders?status=completed` endpoint
- Navigate to OrderDetailsScreen on order tap
- Reorder via `POST /orders/reorder/:id` endpoint

---

#### OrderDetailsScreen
**File**: `app/(tabs)/orders/[id].tsx`

**Components**:
- Header: "Order Details"
- Order ID & Status Badge
- Status Timeline
  - "Order Placed" with timestamp ✓
  - "Confirmed" with timestamp → current step
  - "Preparing" with timestamp (if applicable)
  - "On the Way" with timestamp (if applicable)
  - "Delivered" with timestamp (if completed)
- Store Details
  - Store name
  - Store contact (call button)
  - Store address
- Order Items List
  - Item card (repeating):
    - Item name
    - Quantity
    - Price
    - Special instructions (if any)
- Order Summary
  - Subtotal: ₹XXX
  - Delivery Fee: ₹XX
  - Discount: -₹XXX (if coupon applied)
  - Tax: ₹XX
  - Total: ₹XXX
- Payment Details
  - Payment method (Credit Card, Wallet, etc.)
  - Transaction ID
- Delivery Address
  - Full address
  - Contact number
  - "Map" link
- Action Buttons
  - "Track Order" button (if in transit) → Navigate to TrackingScreen
  - "Rate Order" button (if completed) → Navigate to RatingScreen
  - "Contact Store" button (call)
  - "Contact Rider" button (if in transit, call)
  - "Reorder" button (if completed)

**State**:
- `orderId`: string
- `order`: Order
- `isLoading`: boolean

**Actions**:
- Fetch `GET /orders/:id` endpoint
- Subscribe to real-time updates via socket.io
- Navigate to TrackingScreen
- Navigate to RatingScreen
- Call store/rider

---

#### TrackingScreen
**File**: `app/(tabs)/orders/[id]/tracking.tsx`

**Components**:
- Header: "Track Order"
- Full screen map
  - Store location (🟢 green marker)
  - Rider current location (🔵 blue marker, animated)
  - Customer location (🔴 red marker)
  - Route line
- Bottom sheet panel (dismissible)
  - Order status message
  - Store info (name, address, call button)
  - Rider info (name, photo, rating, call/chat button)
  - "Share order tracking link" button
  - Estimated delivery time countdown
  - Customer location (address, call button)
- Floating action buttons
  - Call store
  - Call rider
  - Chat with rider

**State**:
- `orderId`: string
- `order`: Order
- `riderLocation`: {lat, lng}
- `storeLocation`: {lat, lng}
- `customerLocation`: {lat, lng}
- `mapRegion`: MapRegion
- `estimatedTime`: number (in seconds)

**Actions**:
- Subscribe to real-time location updates via socket.io
- Update map every 5 seconds
- Fetch `GET /orders/:id` endpoint for status
- Call/Chat with rider
- Share tracking link

---

#### RatingScreen
**File**: `app/(tabs)/orders/[id]/rating.tsx`

**Components**:
- "Rate Your Order" header
- Store image & name
- Star rating (tap to rate, 1-5 stars, interactive)
- Rating categories (expandable)
  - "Food Quality" with stars
  - "Delivery Speed" with stars
  - "Rider Behavior" with stars
  - "Packaging" with stars
- Review text input
  - Placeholder: "Share your experience (optional)"
  - Character count limit (500 chars)
- Predefined tags (multi-select chips)
  - "Delicious"
  - "Good packaging"
  - "Fresh ingredients"
  - "Quick delivery"
  - "Not as expected"
  - "Wrong items"
  - "Cold food"
  - etc.
- Upload photo option
- "Submit Rating" button
- "Skip" button

**State**:
- `orderId`: string
- `overallRating`: number (1-5)
- `categoryRatings`: {foodQuality: number, deliverySpeed: number, riderBehavior: number, packaging: number}
- `review`: string
- `selectedTags`: string[]
- `photos`: image[]
- `isSubmitting`: boolean

**Actions**:
- Submit rating via `POST /orders/:id/rate` endpoint
- Upload photos
- Navigate back to OrdersListScreen

---

### 5. MAIN STACK - CART TAB

#### CartScreen
**File**: `app/(tabs)/cart/index.tsx`

**Components**:
- "Cart" header with "Clear Cart" button
- Store banner (if items from single store)
  - Store name
  - "Change Store" button (shows warning)
- Cart Items List
  - Item card (repeating):
    - Item image
    - Item name
    - Item customizations (size, toppings, etc.)
    - Quantity selector (-, count, +)
    - Item subtotal price
    - Remove button (trash icon)
- Special Instructions
  - Text input: "Add delivery instructions"
- Promo Code Section
  - Promo code input field
  - "Apply" button
  - Active promo display (if applied)
    - Code name
    - Discount amount
    - "Remove" button
- Cart Summary
  - Subtotal: ₹XXX
  - Delivery Fee: ₹XX
  - Savings: -₹XXX (if promo applied)
  - Tax: ₹XX
  - **Total: ₹XXX** (highlighted)
- "Proceed to Checkout" button (primary, sticky)
- Empty Cart State (if cart is empty)
  - "Your cart is empty" message
  - "Continue Shopping" button → Navigate to HomeScreen

**State**:
- `cartItems`: CartItem[] (from cart store)
- `promoCode`: string
- `appliedPromo`: Promo | null
- `instructions`: string
- `isApplyingPromo`: boolean

**Actions**:
- Update item quantity
- Remove item from cart
- Apply promo code via `POST /cart/apply-promo`
- Navigate to CheckoutScreen on "Proceed to Checkout"

---

#### CheckoutScreen
**File**: `app/(tabs)/cart/checkout/index.tsx`

**Components**:
- "Checkout" header with back button
- Step indicator
  - Step 1: Address (current step highlighted)
  - Step 2: Delivery Options
  - Step 3: Payment
  - Step 4: Confirmation
- Current step content changes based on active step

---

#### AddressSelectionScreen (Checkout Step 1)
**File**: `app/(tabs)/cart/checkout/address.tsx`

**Components**:
- "Select Delivery Address" header
- Current location option
  - "Use my current location" button
- Saved Addresses List
  - Address card (repeating):
    - Address label (Home, Work, etc.)
    - Full address text
    - Radio button (select)
    - Edit & delete buttons (hidden until selected)
  - "Add New Address" button → Navigate to AddEditAddressScreen
- Selected address preview (highlighted)
- "Confirm Address" button → Navigate to DeliveryOptionsScreen

**State**:
- `addresses`: Address[]
- `selectedAddressId`: string | null
- `isLoadingAddresses`: boolean

**Actions**:
- Fetch `GET /user/addresses` endpoint
- Select address
- Navigate to AddEditAddressScreen
- Navigate to DeliveryOptionsScreen

---

#### DeliveryOptionsScreen (Checkout Step 2)
**File**: `app/(tabs)/cart/checkout/delivery.tsx`

**Components**:
- "Delivery Options" header
- Delivery type selection
  - Standard Delivery
    - "Deliver in 30-45 mins"
    - Fee: ₹50
    - Radio button
  - Express Delivery
    - "Deliver in 15-20 mins"
    - Fee: ₹100
    - Premium badge
    - Radio button
- Special instructions
  - Text input: "Delivery instructions (optional)"
  - E.g., "Ring bell twice", "Leave at door"
- Estimated delivery time display
- "Continue to Payment" button → Navigate to PaymentScreen

**State**:
- `selectedDeliveryType`: "standard" | "express"
- `specialInstructions`: string
- `estimatedTime`: {min: number, max: number}

**Actions**:
- Select delivery type
- Update delivery fee in cart
- Navigate to PaymentScreen

---

#### PaymentScreen (Checkout Step 3)
**File**: `app/(tabs)/cart/checkout/payment.tsx`

**Components**:
- "Select Payment Method" header
- Payment method options
  - Credit/Debit Card
    - Saved cards list (repeating):
      - Card image (Visa/Mastercard icon)
      - "•••• •••• •••• 1234"
      - Expiry date
      - Radio button
    - "Add New Card" link → Navigate to AddCardScreen
  - UPI
    - "Google Pay, PhonePe, etc." text
    - Radio button
  - Wallet
    - "Drop Wallet - Balance: ₹XXX"
    - Radio button
  - Cash on Delivery
    - "Pay when order arrives"
    - Radio button
- Order Summary (sticky at bottom)
  - Subtotal: ₹XXX
  - Delivery Fee: ₹XX
  - Discount: -₹XXX
  - Tax: ₹XX
  - **Total: ₹XXX**
- "Place Order" button (primary) → Initiate payment

**State**:
- `selectedPaymentMethod`: "card" | "upi" | "wallet" | "cod"
- `selectedCard`: Card | null
- `walletBalance`: number
- `isProcessing`: boolean

**Actions**:
- Fetch saved cards
- Fetch wallet balance
- Proceed to payment via `POST /orders/create` endpoint
- Handle payment response (Razorpay)
- Navigate to OrderConfirmationScreen on success

---

#### OrderConfirmationScreen (Checkout Step 4)
**File**: `app/(tabs)/cart/checkout/confirmation.tsx`

**Components**:
- Success animation (checkmark or confetti)
- "Order Placed Successfully!" message
- Order details
  - Order ID (copyable)
  - Order placed at timestamp
- Store details
  - Store name & image
  - "Track Your Order" button → Navigate to TrackingScreen (from Orders tab)
- What's next section
  - "We're preparing your order"
  - Estimated delivery time
- Action buttons
  - "View Order Details" button
  - "Continue Shopping" button → Navigate to HomeScreen
  - "Share Order" button

**State**:
- `orderId`: string
- `order`: Order

**Actions**:
- Clear cart store
- Navigate to TrackingScreen on "Track Your Order"
- Navigate to HomeScreen on "Continue Shopping"

---

### 6. MAIN STACK - PROFILE TAB

#### ProfileScreen
**File**: `app/(tabs)/profile/index.tsx`

**Components**:
- Profile Header
  - Profile picture
  - Name
  - Phone number
  - Edit button → Navigate to EditProfileScreen
- Membership/Status Section
  - Loyalty tier badge
  - Loyalty points
- Menu Items
  - "Saved Addresses" → Navigate to AddressesScreen
  - "Saved Payment Methods" → Navigate to PaymentMethodsScreen
  - "Favorites" → Navigate to FavoritesScreen
  - "Wallet" → Navigate to WalletScreen
  - "Loyalty Program" → Navigate to LoyaltyScreen
  - "Referral Program" → Navigate to ReferralScreen
  - "Settings" → Navigate to SettingsScreen
  - "Support" → Navigate to SupportScreen
  - "Logout" → Show confirmation

**State**:
- `profile`: UserProfile
- `stats`: UserStats

**Actions**:
- Fetch `GET /auth/profile` endpoint
- Show logout confirmation dialog
- Navigate to respective screens

---

#### EditProfileScreen
**File**: `app/(tabs)/profile/edit.tsx`

**Components**:
- "Edit Profile" header
- Profile picture
  - Change photo button
  - Camera/Gallery picker modal
- Form fields
  - Full name input (editable)
  - Phone number (read-only)
  - Email input (editable)
  - Date of birth picker (editable)
  - Bio/About textarea (editable, 200 char limit)
- "Save Changes" button
- "Cancel" button

**State**:
- `formData`: {fullName: string, email: string, dob: Date, bio: string}
- `profilePhoto`: image | null
- `isLoading`: boolean
- `error`: string | null

**Actions**:
- Upload profile photo via `POST /upload` endpoint
- Submit form via `POST /user/profile/update` endpoint
- Navigate back to ProfileScreen

---

#### AddressesScreen
**File**: `app/(tabs)/profile/addresses/index.tsx`

**Components**:
- "Saved Addresses" header with "Add New" button
- Addresses list
  - Address card (repeating):
    - Address label (Home, Work, etc.)
    - Full address text
    - Default indicator badge (if default)
    - Edit button
    - Delete button
    - Tap → Navigate to AddEditAddressScreen
- "Add New Address" button (primary)

**State**:
- `addresses`: Address[]
- `isLoading`: boolean

**Actions**:
- Fetch `GET /user/addresses` endpoint
- Navigate to AddEditAddressScreen (add/edit mode)
- Delete address via `DELETE /user/addresses/:id` endpoint

---

#### AddEditAddressScreen (Modal)
**File**: `app/(tabs)/profile/addresses/[id].tsx`

**Components**:
- "Add Address" or "Edit Address" header
- Address label dropdown
  - Home
  - Work
  - Other (with custom label input)
- Address type selector
  - Apartment
  - House
  - Other
- Full address input (text area)
- Building/Apt number input
- Floor number input (optional)
- Landmark input (optional)
- Set as default address toggle
- "Save Address" button
- "Cancel" button
- Map picker (optional, tap to open map to select location)

**State**:
- `formData`: {label: string, addressType: string, address: string, building: string, floor: string, landmark: string, isDefault: boolean}
- `isLoading`: boolean
- `error`: string | null

**Actions**:
- Save address via `POST /user/addresses` or `PUT /user/addresses/:id` endpoint
- Navigate back to AddressesScreen

---

#### PaymentMethodsScreen
**File**: `app/(tabs)/profile/payments.tsx`

**Components**:
- "Payment Methods" header with "Add New" button
- Saved Cards List
  - Card card (repeating):
    - Card network logo (Visa, Mastercard)
    - Card number (masked): "•••• •••• •••• 1234"
    - Cardholder name
    - Expiry date
    - Default indicator (if default)
    - Edit & delete buttons
    - Tap → Show card details
- "Add New Card" button (primary)
  - Card number input
  - Cardholder name input
  - Expiry date (MM/YY)
  - CVV input
  - Set as default toggle
  - "Save Card" button

**State**:
- `cards`: Card[]
- `showAddCardForm`: boolean
- `formData`: CardForm
- `isLoading`: boolean

**Actions**:
- Fetch saved cards
- Add card via `POST /user/payment-methods` endpoint
- Delete card via `DELETE /user/payment-methods/:id` endpoint

---

#### FavoritesScreen
**File**: `app/(tabs)/profile/favorites.tsx`

**Components**:
- "Favorites" header with sort/filter options
- Favorites list (grid or list view)
  - Item card (repeating):
    - Item image
    - Item name
    - Store name (small)
    - Price
    - Rating
    - Remove from favorites button (heart icon, filled)
    - Tap → Navigate to ProductDetailsScreen
- Empty state (if no favorites)
  - "No favorites yet" message
  - "Add items to your favorites" help text
  - "Continue Shopping" button → Navigate to HomeScreen

**State**:
- `favorites`: FavoriteItem[]
- `isLoading`: boolean

**Actions**:
- Fetch `GET /user/favorites` endpoint
- Remove favorite via `DELETE /user/favorites/:id` endpoint
- Navigate to ProductDetailsScreen

---

#### WalletScreen
**File**: `app/(tabs)/profile/wallet.tsx`

**Components**:
- Wallet balance card (highlighted)
  - "Wallet Balance"
  - ₹XXX in large text
  - "Add Money" button
- Recent Transactions Section
  - Transaction item (repeating):
    - Transaction type icon (credit/debit)
    - Description
    - Amount (+ or -)
    - Date & time
    - Tap → Show transaction details
- Transaction filters
  - "All"
  - "Credits"
  - "Debits"
- "Add Money" button (primary)
  - Opens payment sheet (Razorpay)
  - Amount input (₹100, ₹500, ₹1000, etc., custom option)

**State**:
- `walletBalance`: number
- `transactions`: Transaction[]
- `filterType`: "all" | "credit" | "debit"
- `isLoading`: boolean
- `showAddMoneySheet`: boolean

**Actions**:
- Fetch `GET /user/wallet` endpoint
- Add money via `POST /wallet/add-money` endpoint (Razorpay)
- Filter transactions

---

#### LoyaltyScreen
**File**: `app/(tabs)/profile/loyalty.tsx`

**Components**:
- Loyalty Status Card
  - Current tier (Silver, Gold, Platinum)
  - Total points: XXXX
  - Points to next tier: XXXX
  - Progress bar
  - "Tier Benefits" button → Show benefits popup
- Points History Section
  - Points entry (repeating):
    - Description (e.g., "Order placed", "Referral bonus")
    - Points earned/redeemed (+ or -)
    - Date
- Redeem Points Section
  - Available redemption options:
    - "₹X off on next order" (costs 500 points)
    - "Free delivery" (costs 200 points)
    - etc.
  - "Redeem" button for each option
- Tier Benefits Table
  - Silver tier: 5% discount, free delivery after ₹500
  - Gold tier: 10% discount, free delivery after ₹300
  - Platinum tier: 15% discount, free delivery always

**State**:
- `loyaltyData`: {tier: string, points: number, pointsToNextTier: number, history: PointHistory[]}
- `redemptionOptions`: RedemptionOption[]
- `isLoading`: boolean

**Actions**:
- Fetch `GET /user/loyalty` endpoint
- Redeem points via `POST /user/loyalty/redeem` endpoint

---

#### ReferralScreen
**File**: `app/(tabs)/profile/referral.tsx`

**Components**:
- "Refer & Earn" header
- Referral Stats Card
  - "Friends referred: XX"
  - "Total earned: ₹XXX"
- Your Referral Link Section
  - Referral link (code: DROP12345)
  - Share button → Share sheet (WhatsApp, Email, SMS, Copy)
  - QR code (tap to expand)
- How It Works Section
  - "1. Share your referral link"
  - "2. Your friend orders using link"
  - "3. Both get ₹X credit"
- Referral History
  - Referred friend card (repeating):
    - Friend name
    - Date referred
    - Status (Pending | Active)
    - Earnings so far
- "Share Now" button (primary)

**State**:
- `referralCode`: string
- `referralStats`: {friendsReferred: number, totalEarned: number}
- `referralHistory`: ReferralEntry[]
- `isLoading`: boolean

**Actions**:
- Fetch `GET /user/referral` endpoint
- Share referral link
- Copy referral code

---

#### SettingsScreen
**File**: `app/(tabs)/profile/settings.tsx`

**Components**:
- "Settings" header
- Notification Preferences
  - "Order updates" toggle
  - "Promotions & offers" toggle
  - "Reviews & ratings" toggle
  - "News & updates" toggle
- App Preferences
  - Language selector (English, Hindi, etc.)
  - Dark mode toggle
- Account & Security
  - "Change Password" → Navigate to change password modal
  - "Two-Factor Authentication" toggle
- Data & Privacy
  - "Clear app cache" button
  - "Delete account" button (warning, confirms)
- About
  - App version (v2.0.0)
  - Build number
  - "Terms of Service" link
  - "Privacy Policy" link
  - "Contact Us" link

**State**:
- `settings`: UserSettings
- `isSaving`: boolean

**Actions**:
- Update settings via `POST /user/settings` endpoint
- Clear cache
- Delete account (with confirmation)

---

#### SupportScreen
**File**: `app/(tabs)/profile/support.tsx`

**Components**:
- "Support" header
- Help Categories
  - Category card (repeating):
    - "Orders & Delivery"
    - "Payments & Wallet"
    - "Accounts & Loyalty"
    - "Technical Issues"
  - Tap → Expand FAQ for that category
- FAQs (Accordion)
  - FAQ item (repeating):
    - Question
    - Expandable answer
- Contact Support Section
  - "Chat with Us" button → Open chat interface
  - "Call Support" button → Dial support number
  - "Email Us" link
  - Support hours display
- Report Issue Button
  - Opens modal:
    - Issue type dropdown
    - Description input
    - Screenshot upload option
    - "Submit" button

**State**:
- `faqs`: FAQ[]
- `expandedFAQId`: string | null
- `showChatInterface`: boolean
- `showIssueModal`: boolean

**Actions**:
- Fetch `GET /support/faqs` endpoint
- Open chat
- Submit issue via `POST /support/report-issue` endpoint

---

### Additional Screens (Not in Tab Navigation)

#### ProductDetailsScreen (Modal/Stack)
**File**: `app/product/[id].tsx`

**Components**:
- Close/Back button (overlay)
- Product image carousel
- Product name
- Category tag
- Rating & reviews count
- Price (₹XXX)
- Store name with link to store details
- Product description
- Customization Options Section (if applicable)
  - Size selector (S, M, L, XL)
  - Toppings/Add-ons (checkboxes)
    - Extra cheese (+₹30)
    - Bacon (+₹50)
    - etc.
- Special instructions input
- Quantity selector (-, count, +)
- Reviews Section
  - Recent review cards (3)
  - "View All Reviews" link
- Floating action button
  - "Add to Cart" button (shows price calculation including customizations)
- Similar Items Section (horizontal scroll)

**State**:
- `product`: Product
- `selectedCustomizations`: Customization[]
- `quantity`: number
- `specialInstructions`: string
- `totalPrice`: number

**Actions**:
- Fetch `GET /products/:id` endpoint
- Update customizations & price calculation
- Add to cart via cart store action
- Close modal

---

## State Management Structure

```typescript
// authStore.ts
{
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  login: (phone) => Promise
  verifyOTP: (otp) => Promise
  logout: () => Promise
}

// cartStore.ts
{
  items: CartItem[]
  store: Store | null
  promoCode: PromoCode | null
  instructions: string
  addItem: (item, customizations) => void
  removeItem: (itemId) => void
  updateQuantity: (itemId, quantity) => void
  clearCart: () => void
  applyPromo: (code) => Promise
}

// orderStore.ts
{
  orders: Order[]
  activeOrders: Order[]
  completedOrders: Order[]
  fetchOrders: () => Promise
  fetchOrderDetails: (id) => Promise
}

// locationStore.ts
{
  selectedLocation: Address | null
  setLocation: (address) => void
}

// userStore.ts
{
  profile: UserProfile | null
  addresses: Address[]
  favorites: FavoriteItem[]
  fetchAddresses: () => Promise
}

// walletStore.ts
{
  balance: number
  transactions: Transaction[]
  fetchWallet: () => Promise
}
```

---

## API Integration Points Summary

| Screen | Endpoint | Method | Purpose |
|--------|----------|--------|---------|
| LoginScreen | `/auth/otp/send` | POST | Send OTP |
| OTPVerificationScreen | `/auth/otp/verify` | POST | Verify & get token |
| HomeScreen | `/products/featured-stores` | GET | Get featured stores |
| HomeScreen | `/products/banners` | GET | Get promotional banners |
| CategoryScreen | `/products/stores` | GET | Get stores by category |
| StoreDetailsScreen | `/products/store/:id` | GET | Get store info |
| StoreDetailsScreen | `/products/store/:id/menu` | GET | Get menu items |
| SearchResultsScreen | `/search` | GET | Search stores/products |
| CartScreen | `/cart/apply-promo` | POST | Apply promo code |
| CheckoutScreen | `/orders/create` | POST | Create order |
| CheckoutScreen | `/payments/razorpay/verify` | POST | Verify payment |
| OrderDetailsScreen | `/orders/:id` | GET | Get order details |
| RatingScreen | `/orders/:id/rate` | POST | Submit rating |
| AddressesScreen | `/user/addresses` | GET | Get addresses |
| AddEditAddressScreen | `/user/addresses` | POST/PUT | Save address |
| PaymentMethodsScreen | `/user/payment-methods` | GET/POST/DELETE | Manage cards |
| FavoritesScreen | `/user/favorites` | GET/DELETE | Manage favorites |
| WalletScreen | `/user/wallet` | GET | Get wallet balance |
| WalletScreen | `/wallet/add-money` | POST | Add money to wallet |
| LoyaltyScreen | `/user/loyalty` | GET | Get loyalty data |
| ReferralScreen | `/user/referral` | GET | Get referral data |

---

## Socket.io Events

- `order:status-updated` - Order status changed
- `order:rider-assigned` - Rider assigned to order
- `rider:location-updated` - Rider location updated
- `notification:new` - New notification received
- `cart:shared` - Party cart shared
