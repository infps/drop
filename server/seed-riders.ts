import { db } from './src/db'
import {
  users,
  addresses,
  vendors,
  products,
  riders,
  riderEarnings,
  orders,
  orderItems,
  orderStatusHistory,
} from './src/db/schema'
import { eq, and } from 'drizzle-orm'

async function seedRiders() {
  console.log('Seeding rider data...')

  // Create test users
  const testUsers = [
    {
      phone: '+919876543210',
      email: 'user1@test.com',
      name: 'John Doe',
    },
    {
      phone: '+919876543211',
      email: 'user2@test.com',
      name: 'Jane Smith',
    },
  ]

  const createdUsers = []
  for (const user of testUsers) {
    const [existing] = await db.select().from(users).where(eq(users.phone, user.phone)).limit(1)
    if (!existing) {
      const [created] = await db.insert(users).values(user).returning()
      createdUsers.push(created)
      console.log('User created:', user.name)
    } else {
      createdUsers.push(existing)
      console.log('User exists:', user.name)
    }
  }

  // Create addresses for users
  const testAddresses = [
    {
      userId: createdUsers[0].id,
      label: 'Home',
      fullAddress: '123 MG Road, Bangalore',
      landmark: 'Near Metro Station',
      latitude: 12.9716,
      longitude: 77.5946,
      isDefault: true,
    },
    {
      userId: createdUsers[1].id,
      label: 'Home',
      fullAddress: '456 Brigade Road, Bangalore',
      landmark: 'Opposite Park',
      latitude: 12.9750,
      longitude: 77.6100,
      isDefault: true,
    },
  ]

  const createdAddresses = []
  for (const address of testAddresses) {
    const [created] = await db.insert(addresses).values(address).returning()
    createdAddresses.push(created)
    console.log('Address created for user:', address.userId)
  }

  // Create test vendors
  const testVendors = [
    {
      name: 'Pizza Palace',
      type: 'RESTAURANT' as const,
      email: 'pizza@test.com',
      phone: '+919876540001',
      address: '789 Koramangala, Bangalore',
      latitude: 12.9352,
      longitude: 77.6245,
      openingTime: '10:00',
      closingTime: '23:00',
      isActive: true,
      isVerified: true,
    },
    {
      name: 'Fresh Mart',
      type: 'GROCERY' as const,
      email: 'mart@test.com',
      phone: '+919876540002',
      address: '321 Indiranagar, Bangalore',
      latitude: 12.9716,
      longitude: 77.6412,
      openingTime: '08:00',
      closingTime: '22:00',
      isActive: true,
      isVerified: true,
    },
  ]

  const createdVendors = []
  for (const vendor of testVendors) {
    const [existing] = await db.select().from(vendors).where(eq(vendors.email, vendor.email)).limit(1)
    if (!existing) {
      const [created] = await db.insert(vendors).values(vendor).returning()
      createdVendors.push(created)
      console.log('Vendor created:', vendor.name)
    } else {
      createdVendors.push(existing)
      console.log('Vendor exists:', vendor.name)
    }
  }

  // Create test products
  const testProducts = [
    {
      vendorId: createdVendors[0].id,
      name: 'Margherita Pizza',
      description: 'Classic cheese pizza',
      price: 299,
      isAvailable: true,
    },
    {
      vendorId: createdVendors[0].id,
      name: 'Pepperoni Pizza',
      description: 'Spicy pepperoni',
      price: 399,
      isAvailable: true,
    },
    {
      vendorId: createdVendors[1].id,
      name: 'Fresh Milk 1L',
      description: 'Farm fresh milk',
      price: 60,
      isAvailable: true,
    },
  ]

  const createdProducts = []
  for (const product of testProducts) {
    const [existing] = await db.select().from(products).where(
      and(
        eq(products.vendorId, product.vendorId),
        eq(products.name, product.name)
      )
    ).limit(1)

    if (!existing) {
      const [created] = await db.insert(products).values(product).returning()
      createdProducts.push(created)
      console.log('Product created:', product.name)
    } else {
      createdProducts.push(existing)
      console.log('Product exists:', product.name)
    }
  }

  // Create test riders
  const testRiders = [
    {
      phone: '+919876550001',
      email: 'rider1@test.com',
      name: 'Ravi Kumar',
      vehicleType: 'BIKE' as const,
      vehicleNumber: 'KA01AB1234',
      documentVerified: true,
      policeVerified: true,
      isOnline: true,
      isAvailable: true,
      currentLat: 12.9716,
      currentLng: 77.5946,
      assignedZone: 'Koramangala',
      rating: 4.8,
      totalDeliveries: 150,
      totalEarnings: 12000,
    },
    {
      phone: '+919876550002',
      email: 'rider2@test.com',
      name: 'Amit Sharma',
      vehicleType: 'SCOOTER' as const,
      vehicleNumber: 'KA02CD5678',
      documentVerified: true,
      policeVerified: true,
      isOnline: true,
      isAvailable: true,
      currentLat: 12.9352,
      currentLng: 77.6245,
      assignedZone: 'Indiranagar',
      rating: 4.5,
      totalDeliveries: 100,
      totalEarnings: 8000,
    },
    {
      phone: '+919876550003',
      email: 'rider3@test.com',
      name: 'Suresh Reddy',
      vehicleType: 'BIKE' as const,
      vehicleNumber: 'KA03EF9012',
      documentVerified: true,
      policeVerified: false,
      isOnline: false,
      isAvailable: true,
      currentLat: 12.9750,
      currentLng: 77.6100,
      assignedZone: 'MG Road',
      rating: 4.2,
      totalDeliveries: 50,
      totalEarnings: 4000,
    },
  ]

  const createdRiders = []
  for (const rider of testRiders) {
    const [existing] = await db.select().from(riders).where(eq(riders.phone, rider.phone)).limit(1)
    if (!existing) {
      const [created] = await db.insert(riders).values(rider).returning()
      createdRiders.push(created)
      console.log('Rider created:', rider.name)
    } else {
      createdRiders.push(existing)
      console.log('Rider exists:', rider.name)
    }
  }

  // Create test orders
  const testOrders = [
    {
      orderNumber: 'DRP1234567890',
      userId: createdUsers[0].id,
      vendorId: createdVendors[0].id,
      addressId: createdAddresses[0].id,
      riderId: createdRiders[0].id,
      status: 'OUT_FOR_DELIVERY' as const,
      type: 'DELIVERY' as const,
      subtotal: 299,
      deliveryFee: 40,
      platformFee: 10,
      discount: 0,
      tip: 20,
      total: 369,
      paymentMethod: 'UPI',
      paymentStatus: 'COMPLETED' as const,
      currentLat: 12.9716,
      currentLng: 77.5946,
    },
    {
      orderNumber: 'DRP1234567891',
      userId: createdUsers[1].id,
      vendorId: createdVendors[1].id,
      addressId: createdAddresses[1].id,
      riderId: createdRiders[0].id,
      status: 'PICKED_UP' as const,
      type: 'DELIVERY' as const,
      subtotal: 180,
      deliveryFee: 30,
      platformFee: 5,
      discount: 20,
      tip: 0,
      total: 195,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING' as const,
      currentLat: 12.9716,
      currentLng: 77.5946,
    },
    {
      orderNumber: 'DRP1234567892',
      userId: createdUsers[0].id,
      vendorId: createdVendors[0].id,
      addressId: createdAddresses[0].id,
      riderId: null,
      status: 'READY_FOR_PICKUP' as const,
      type: 'DELIVERY' as const,
      subtotal: 399,
      deliveryFee: 40,
      platformFee: 10,
      discount: 0,
      tip: 15,
      total: 464,
      paymentMethod: 'CARD',
      paymentStatus: 'COMPLETED' as const,
    },
    {
      orderNumber: 'DRP1234567893',
      userId: createdUsers[1].id,
      vendorId: createdVendors[0].id,
      addressId: createdAddresses[1].id,
      riderId: createdRiders[1].id,
      status: 'DELIVERED' as const,
      type: 'DELIVERY' as const,
      subtotal: 698,
      deliveryFee: 50,
      platformFee: 15,
      discount: 50,
      tip: 30,
      total: 743,
      paymentMethod: 'UPI',
      paymentStatus: 'COMPLETED' as const,
      deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  ]

  const createdOrders = []
  for (const order of testOrders) {
    const [existing] = await db.select().from(orders).where(eq(orders.orderNumber, order.orderNumber)).limit(1)

    if (!existing) {
      const [created] = await db.insert(orders).values(order).returning()
      createdOrders.push(created)
      console.log('Order created:', order.orderNumber)

      // Add order status history
      await db.insert(orderStatusHistory).values({
        orderId: created.id,
        status: order.status,
      })
    } else {
      createdOrders.push(existing)
      console.log('Order exists:', order.orderNumber)
    }
  }

  // Create order items
  const testOrderItems = [
    { orderId: createdOrders[0].id, productId: createdProducts[0].id, quantity: 1, price: 299 },
    { orderId: createdOrders[1].id, productId: createdProducts[2].id, quantity: 3, price: 60 },
    { orderId: createdOrders[2].id, productId: createdProducts[1].id, quantity: 1, price: 399 },
    { orderId: createdOrders[3].id, productId: createdProducts[0].id, quantity: 1, price: 299 },
    { orderId: createdOrders[3].id, productId: createdProducts[1].id, quantity: 1, price: 399 },
  ]

  for (const item of testOrderItems) {
    const [existing] = await db.select().from(orderItems).where(
      and(
        eq(orderItems.orderId, item.orderId),
        eq(orderItems.productId, item.productId)
      )
    ).limit(1)

    if (!existing) {
      await db.insert(orderItems).values(item)
    }
  }
  console.log('Order items checked/created')

  // Create rider earnings
  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const testEarnings = [
    {
      riderId: createdRiders[0].id,
      date: today,
      baseEarning: 32,
      tip: 20,
      incentive: 0,
      penalty: 0,
      total: 52,
    },
    {
      riderId: createdRiders[0].id,
      date: yesterday,
      baseEarning: 24,
      tip: 0,
      incentive: 10,
      penalty: 0,
      total: 34,
    },
    {
      riderId: createdRiders[0].id,
      date: lastWeek,
      baseEarning: 28,
      tip: 10,
      incentive: 0,
      penalty: 5,
      total: 33,
    },
    {
      riderId: createdRiders[1].id,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      baseEarning: 40,
      tip: 30,
      incentive: 5,
      penalty: 0,
      total: 75,
    },
  ]

  for (const earning of testEarnings) {
    const [existing] = await db.select().from(riderEarnings).where(
      and(
        eq(riderEarnings.riderId, earning.riderId),
        eq(riderEarnings.baseEarning, earning.baseEarning),
        eq(riderEarnings.tip, earning.tip)
      )
    ).limit(1)

    if (!existing) {
      await db.insert(riderEarnings).values(earning)
    }
  }
  console.log('Rider earnings checked/created')

  console.log('\n=== Seed Summary ===')
  console.log(`Users: ${createdUsers.length}`)
  console.log(`Addresses: ${createdAddresses.length}`)
  console.log(`Vendors: ${createdVendors.length}`)
  console.log(`Products: ${createdProducts.length}`)
  console.log(`Riders: ${createdRiders.length}`)
  console.log(`Orders: ${createdOrders.length}`)
  console.log(`Earnings: ${testEarnings.length}`)
  console.log('\n=== Test Rider Credentials ===')
  createdRiders.forEach(rider => {
    console.log(`${rider.name} - Phone: ${rider.phone}`)
  })
}

seedRiders()
  .then(() => {
    console.log('\nSeed complete')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
