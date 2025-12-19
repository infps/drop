# DROP Mobile Apps - Quick Reference Guide

## Development Order (Sequential Completion)

---

## 1️⃣ RIDER MOBILE APP (Start Here)
**Estimated Duration**: 4-6 weeks
**Complexity**: Medium
**Team Size**: 1-2 developers

### Quick Checklist

**Phase 1: Setup (Week 1)**
- ✅ Expo project configuration
- ✅ API client setup
- ✅ Auth flow (OTP login)
- ✅ Tab navigation setup
- ✅ State management (Zustand)

**Phase 2: Core Features (Weeks 2-3)**
- ✅ Dashboard with order list
- ✅ Accept/Reject orders
- ✅ Orders tracking screen
- ✅ Earnings screen
- ✅ Profile management
- ✅ Socket.io notifications

**Phase 3: Advanced (Week 4)**
- ✅ Real-time map tracking
- ✅ Customer ratings
- ✅ Document uploads
- ✅ Push notifications

**Phase 4: Testing (Week 5-6)**
- ✅ Unit & integration tests
- ✅ Device testing
- ✅ Performance optimization
- ✅ Build APK/IPA

### Key Screens
1. Login/OTP
2. Dashboard (active orders)
3. Orders (active & history)
4. Earnings
5. Profile
6. Order Details
7. Map Tracking

### API Dependencies
- `POST /auth/otp/send`
- `POST /auth/otp/verify`
- `GET /rider/orders`
- `POST /rider/orders/:id/accept`
- `POST /rider/orders/:id/update-status`
- `GET /rider/earnings`
- `GET /orders/:id`

### Critical Features
🔴 Real-time order notifications (socket.io)
🔴 Order acceptance/rejection flow
🔴 Earnings calculation
🟡 Map integration (can be MVP without advanced features)

---

## 2️⃣ USER/CUSTOMER MOBILE APP (Build Next)
**Estimated Duration**: 6-8 weeks
**Complexity**: High
**Team Size**: 2-3 developers

### Quick Checklist

**Phase 1: Setup (Week 1)**
- ✅ Expo project configuration
- ✅ API client setup
- ✅ Auth flow (OTP login)
- ✅ Tab navigation
- ✅ State management

**Phase 2: Browse & Search (Weeks 2-3)**
- ✅ Home screen with categories
- ✅ Store listing
- ✅ Search functionality
- ✅ Store details & menu
- ✅ Product customization

**Phase 3: Cart & Checkout (Week 4)**
- ✅ Shopping cart
- ✅ Checkout flow
- ✅ Address selection/management
- ✅ Payment integration (Razorpay)
- ✅ Order confirmation

**Phase 4: Advanced Features (Week 5)**
- ✅ Real-time order tracking
- ✅ Wallet management
- ✅ Loyalty points
- ✅ Party mode
- ✅ Saved favorites

**Phase 5: Testing (Weeks 6-7)**
- ✅ Checkout flow testing
- ✅ Payment testing
- ✅ Performance optimization
- ✅ Build & deploy

### Key Screens
1. Login/OTP
2. Home (categories, featured)
3. Search
4. Store Details
5. Product Details
6. Cart
7. Checkout
8. Order Tracking
9. Orders History
10. Profile
11. Addresses
12. Wallet

### API Dependencies
- `GET /products`
- `GET /products/search`
- `GET /products/:id`
- `POST /cart/add`
- `GET /cart`
- `POST /orders/create`
- `GET /orders`
- `GET /orders/:id`
- `POST /payments/razorpay/create-order`
- `POST /payments/razorpay/verify`

### Critical Features
🔴 Checkout flow (secure & intuitive)
🔴 Payment integration
🔴 Real-time order tracking
🔴 Search & filtering
🟡 Loyalty program (can be added later)
🟡 Party mode (can be V2 feature)

---

## 3️⃣ VENDOR MOBILE APP (Build Last)
**Estimated Duration**: 6-8 weeks
**Complexity**: High
**Team Size**: 2-3 developers

### Quick Checklist

**Phase 1: Setup (Week 1)**
- ✅ Expo project configuration
- ✅ API client setup
- ✅ Auth flow (email/phone login)
- ✅ Tab navigation
- ✅ State management

**Phase 2: Core Features (Weeks 2-3)**
- ✅ Dashboard with metrics
- ✅ Orders list & filtering
- ✅ Order details & status updates
- ✅ Menu management (view, add, edit)
- ✅ Online/Offline toggle

**Phase 3: RMS Features (Week 4)**
- ✅ Kitchen Display System (KDS)
- ✅ Reservation management
- ✅ Table management
- ✅ Bill generation

**Phase 4: Advanced (Week 5)**
- ✅ Analytics dashboard
- ✅ Staff management
- ✅ Inventory tracking
- ✅ Settings & configuration

**Phase 5: Testing (Weeks 6-7)**
- ✅ Order flow testing
- ✅ KDS functionality
- ✅ Multi-user testing
- ✅ Performance tuning
- ✅ Build & deploy

### Key Screens
1. Login
2. Dashboard
3. Orders (list, details)
4. Menu Management
5. Kitchen Display (KDS)
6. Reservations
7. Analytics
8. Staff
9. Inventory
10. Settings
11. Profile

### API Dependencies
- `POST /auth/login`
- `GET /vendor/dashboard`
- `GET /vendor/orders`
- `POST /vendor/orders/:id/status`
- `GET /vendor/menu`
- `POST /vendor/menu/add`
- `POST /vendor/menu/:id/update`
- `DELETE /vendor/menu/:id`
- `GET /vendor/staff`
- `GET /vendor/inventory`

### Critical Features
🔴 Real-time order management
🔴 Kitchen Display System
🔴 Menu management
🔴 Accurate earnings/revenue display
🟡 Analytics (can be simplified in MVP)
🟡 Staff management (can be V2)
🟡 Inventory (can be V2)

---

## Shared Architecture (Build Across All Apps)

### API Client Layer
```
├── api/
│   ├── client.ts (axios instance with interceptors)
│   ├── auth.ts (auth endpoints)
│   ├── orders.ts (orders endpoints)
│   ├── products.ts (products endpoints)
│   └── [domain].ts (other domains)
```

### State Management (Zustand)
```
├── store/
│   ├── authStore.ts (user, token, login/logout)
│   ├── orderStore.ts (orders, cart)
│   ├── appStore.ts (notifications, errors)
│   └── [domain]Store.ts (other domains)
```

### Components
```
├── components/
│   ├── ui/ (Button, Input, Modal, Card, etc.)
│   ├── layout/ (Header, TabBar, etc.)
│   └── [feature]/ (feature-specific components)
```

### Utilities
```
├── utils/
│   ├── validation.ts
│   ├── formatting.ts (currency, date, phone)
│   ├── storage.ts (secure storage)
│   └── errors.ts (error handling)
```

### Types
```
├── types/
│   ├── auth.ts
│   ├── user.ts
│   ├── order.ts
│   ├── product.ts
│   ├── vendor.ts
│   └── rider.ts
```

---

## Tech Stack Summary

| Aspect | Technology |
|--------|------------|
| **Framework** | React Native 0.81.5 |
| **Router** | Expo Router 6.0 |
| **Navigation** | React Navigation 7.4 |
| **State Management** | Zustand 5.x |
| **HTTP Client** | Axios (recommended) |
| **Real-time** | Socket.io client |
| **Maps** | React Native Maps or Leaflet |
| **Payments** | Razorpay SDK |
| **Storage** | Expo Secure Store + AsyncStorage |
| **Notifications** | Expo Notifications |
| **UI Icons** | @expo/vector-icons |
| **Animations** | React Native Reanimated |
| **Styling** | StyleSheet + Custom Theme |

---

## Success Metrics

### Rider App ✅
- [ ] Can accept/complete 5+ orders without errors
- [ ] Real-time notifications working
- [ ] Earnings calculated correctly
- [ ] Map shows location accurately
- [ ] App response time < 2 seconds

### User App ✅
- [ ] Can browse and add items to cart
- [ ] Checkout completes successfully
- [ ] Payment processes without errors
- [ ] Order tracking shows real-time updates
- [ ] Search finds products/stores correctly
- [ ] App response time < 3 seconds

### Vendor App ✅
- [ ] Dashboard shows accurate metrics
- [ ] Can update order statuses
- [ ] Can manage menu items
- [ ] KDS displays orders correctly
- [ ] Multiple concurrent operations work smoothly

---

## Deployment Checklist

For each app:
- [ ] All environment variables configured
- [ ] API endpoints verified against v2 server
- [ ] Error handling covers all edge cases
- [ ] Offline support implemented (if applicable)
- [ ] Push notifications tested
- [ ] Security: No hardcoded credentials
- [ ] Performance: Bundle size < 30MB
- [ ] Tested on real devices (iOS + Android)
- [ ] Privacy policy reviewed
- [ ] App store guidelines verified
- [ ] Analytics/Crash reporting configured

---

## Estimated Timeline

```
Week 1-6:    Rider App (Setup + Phase 2-4)
Week 7-14:   User App (Setup + Phase 2-5)
Week 15-22:  Vendor App (Setup + Phase 2-5)

Total: ~22 weeks (5-6 months) for all three apps
```

### Parallel Development Option
If you have 3+ developers:
- Developer 1: Rider App
- Developer 2: User App
- Developer 3: Vendor App
- Estimated: 6-8 weeks total

---

## Support Resources

- **Expo Documentation**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **Expo Router**: https://expo.github.io/router
- **React Navigation**: https://reactnavigation.org
- **Zustand**: https://github.com/pmndrs/zustand

---

## Next Steps

1. **Review** this document with your team
2. **Set up** shared component library first
3. **Start** with Rider App (simplest scope)
4. **Reuse** patterns in User and Vendor apps
5. **Deploy** progressively to test users
