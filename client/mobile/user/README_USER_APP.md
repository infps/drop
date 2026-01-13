# DROP User Mobile App

Customer-facing mobile app for ordering food, groceries, and more.

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server
bun start

# Run on iOS
bun run ios

# Run on Android
bun run android
```

## Prerequisites

- Backend running at `http://localhost:3001` (server-legacy)
- Expo CLI installed globally
- iOS Simulator or Android Emulator
- Or Expo Go app on physical device

## Environment

Create/verify `.env` file:
```
EXPO_PUBLIC_API_URL=http://localhost:3001/api/v1
```

**For Physical Device**: Replace `localhost` with your computer's IP address:
```
EXPO_PUBLIC_API_URL=http://192.168.1.100:3001/api/v1
```

## Project Structure

```
app/
├── index.tsx           # Splash screen
├── _layout.tsx         # Root layout
├── (auth)/             # Auth screens
│   ├── login.tsx
│   └── verify-otp.tsx
└── (tabs)/             # Main app tabs
    ├── home.tsx        # Vendor discovery
    ├── search.tsx      # Search
    ├── orders.tsx      # Orders list
    ├── cart.tsx        # Shopping cart
    └── profile.tsx     # User profile

services/               # API services
store/                  # Zustand state management
types/                  # TypeScript types
utils/                  # Utilities
```

## Features

### Implemented ✅
- OTP authentication
- Vendor browsing
- Search (vendors & products)
- Cart management
- Order history
- Profile display

### In Progress 🚧
- Store details
- Checkout flow
- Order tracking
- Address management

## Tech Stack

- **Framework**: Expo 54 + React Native 0.81
- **Navigation**: Expo Router 6
- **State**: Zustand
- **HTTP**: Axios
- **Storage**: AsyncStorage
- **Icons**: @expo/vector-icons (MaterialIcons)

## API Integration

Backend: `server-legacy` (Hono + Bun)

Key Endpoints:
- `POST /auth/send-otp` - Send OTP
- `POST /auth/verify-otp` - Verify OTP, get JWT
- `GET /auth/me` - Get current user
- `GET /products` - List vendors
- `GET /search` - Search
- `GET /orders` - List orders

All requests auto-include JWT via axios interceptor.

## Development

### Adding a Screen

1. Create file in `app/(tabs)/` or `app/`
2. Export default React component
3. Use Expo Router for navigation

Example:
```tsx
// app/new-screen.tsx
import { View, Text } from 'react-native'

export default function NewScreen() {
  return <View><Text>New Screen</Text></View>
}
```

### Adding API Service

1. Create service in `services/`
2. Import `api` from `./api.ts`
3. Export functions

Example:
```typescript
// services/example.service.ts
import { api } from './api'

export const exampleService = {
  async getData() {
    return api.get('/endpoint')
  }
}
```

### Adding Store

1. Create store in `store/`
2. Use `create` from zustand
3. Export store hook

Example:
```typescript
// store/example-store.ts
import { create } from 'zustand'

interface ExampleState {
  count: number
  increment: () => void
}

export const useExampleStore = create<ExampleState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}))
```

## Troubleshooting

### Can't connect to backend
- Ensure server-legacy is running on port 3001
- Check EXPO_PUBLIC_API_URL in .env
- For physical device, use computer's IP, not localhost

### App won't start
```bash
# Clear cache
bun start -c

# Reset Expo
rm -rf .expo node_modules
bun install
```

### Build errors
```bash
# iOS pods
cd ios && pod install && cd ..

# Android clean
cd android && ./gradlew clean && cd ..
```

## Testing

### Manual Testing Flow
1. Open app → redirects to login
2. Enter phone number → sends OTP
3. Enter OTP → logs in, navigates to home
4. Browse vendors on home screen
5. Use search to find restaurants
6. Check orders (will be empty initially)
7. View profile
8. Logout → returns to login

### Backend Testing
Ensure backend has test users/vendors:
```bash
cd server-legacy
# Check if seed script exists
bun run seed  # if available
```

## Deployment

### iOS
```bash
eas build --platform ios
eas submit --platform ios
```

### Android
```bash
eas build --platform android
eas submit --platform android
```

Requires Expo EAS account and configuration.

## See Also

- [MVP_STATUS.md](./MVP_STATUS.md) - Detailed implementation status
- [../../server-legacy/API_ROUTES.md](../../server-legacy/API_ROUTES.md) - Backend API docs

## Support

Issues: https://github.com/anthropics/drop/issues
Docs: https://docs.expo.dev/
