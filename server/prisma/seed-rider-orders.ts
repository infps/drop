import prisma from '../src/lib/prisma';

async function main() {
  console.log('Seeding rider orders...');

  // Find or create a test user
  let user = await prisma.user.findFirst({
    where: { phone: '9999999999' },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phone: '9999999999',
        name: 'Test Customer',
        email: 'testcustomer@example.com',
      },
    });
    console.log('Created test user:', user.id);
  }

  // Create an address for the user
  let address = await prisma.address.findFirst({
    where: { userId: user.id },
  });

  if (!address) {
    address = await prisma.address.create({
      data: {
        userId: user.id,
        label: 'Home',
        fullAddress: '123 Test Street, Test City, 560001',
        landmark: 'Near Test Mall',
        latitude: 12.9716,
        longitude: 77.5946,
        isDefault: true,
      },
    });
    console.log('Created test address:', address.id);
  }

  // Find or create a test vendor
  let vendor = await prisma.vendor.findFirst({
    where: { name: 'Test Restaurant' },
  });

  if (!vendor) {
    vendor = await prisma.vendor.create({
      data: {
        name: 'Test Restaurant',
        type: 'RESTAURANT',
        description: 'A delicious test restaurant',
        address: '456 Food Street, Test City',
        latitude: 12.9716,
        longitude: 77.5946,
        isActive: true,
        isVerified: true,
        rating: 4.5,
        minimumOrder: 100,
        openingTime: '09:00',
        closingTime: '22:00',
      },
    });
    console.log('Created test vendor:', vendor.id);
  }

  // Create test products if they don't exist
  let products = await prisma.product.findMany({
    where: { vendorId: vendor.id },
    take: 3,
  });

  if (products.length === 0) {
    const productData = [
      { name: 'Butter Chicken', price: 350, description: 'Creamy butter chicken with naan' },
      { name: 'Paneer Tikka', price: 250, description: 'Grilled cottage cheese with spices' },
      { name: 'Biryani', price: 280, description: 'Aromatic rice with spices and vegetables' },
    ];

    for (const p of productData) {
      const product = await prisma.product.create({
        data: {
          vendorId: vendor.id,
          name: p.name,
          description: p.description,
          price: p.price,
          inStock: true,
          isVeg: p.name === 'Paneer Tikka' || p.name === 'Biryani',
        },
      });
      products.push(product);
    }
    console.log('Created test products:', products.length);
  }

  // Find the rider (the one you logged in as)
  const rider = await prisma.rider.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  if (!rider) {
    console.log('No rider found. Please register as a rider first.');
    return;
  }

  console.log('Found rider:', rider.id, rider.name);

  // Create available orders (READY_FOR_PICKUP, no rider assigned)
  console.log('\nCreating available orders...');

  for (let i = 0; i < 3; i++) {
    const subtotal = 300 + Math.floor(Math.random() * 400);
    const deliveryFee = 30 + Math.floor(Math.random() * 20);
    const total = subtotal + deliveryFee;

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        vendorId: vendor.id,
        addressId: address.id,
        status: 'READY_FOR_PICKUP',
        type: 'DELIVERY',
        subtotal,
        deliveryFee,
        platformFee: 10,
        total,
        paymentMethod: 'UPI',
        paymentStatus: 'COMPLETED',
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000), // 30 mins from now
        items: {
          create: [
            {
              productId: products[Math.floor(Math.random() * products.length)].id,
              quantity: 1 + Math.floor(Math.random() * 2),
              price: subtotal,
            },
          ],
        },
        statusHistory: {
          create: [
            { status: 'PENDING', note: 'Order placed' },
            { status: 'CONFIRMED', note: 'Order confirmed by restaurant' },
            { status: 'PREPARING', note: 'Restaurant is preparing your order' },
            { status: 'READY_FOR_PICKUP', note: 'Order ready for pickup' },
          ],
        },
      },
    });
    console.log(`Created available order #${i + 1}:`, order.orderNumber);
  }

  // Create active deliveries (assigned to rider)
  console.log('\nCreating active deliveries for rider...');

  // One PICKED_UP order
  const pickedUpOrder = await prisma.order.create({
    data: {
      userId: user.id,
      vendorId: vendor.id,
      addressId: address.id,
      riderId: rider.id,
      status: 'PICKED_UP',
      type: 'DELIVERY',
      subtotal: 450,
      deliveryFee: 40,
      platformFee: 10,
      tip: 20,
      total: 520,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      estimatedDelivery: new Date(Date.now() + 20 * 60 * 1000),
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            price: 450,
          },
        ],
      },
      statusHistory: {
        create: [
          { status: 'PENDING', note: 'Order placed' },
          { status: 'CONFIRMED', note: 'Order confirmed' },
          { status: 'PREPARING', note: 'Preparing' },
          { status: 'READY_FOR_PICKUP', note: 'Ready for pickup' },
          { status: 'PICKED_UP', note: 'Picked up by rider' },
        ],
      },
    },
  });
  console.log('Created PICKED_UP order:', pickedUpOrder.orderNumber);

  // One OUT_FOR_DELIVERY order
  const outForDeliveryOrder = await prisma.order.create({
    data: {
      userId: user.id,
      vendorId: vendor.id,
      addressId: address.id,
      riderId: rider.id,
      status: 'OUT_FOR_DELIVERY',
      type: 'DELIVERY',
      subtotal: 380,
      deliveryFee: 35,
      platformFee: 10,
      tip: 30,
      total: 455,
      paymentMethod: 'UPI',
      paymentStatus: 'COMPLETED',
      estimatedDelivery: new Date(Date.now() + 10 * 60 * 1000),
      currentLat: 12.9716,
      currentLng: 77.5946,
      items: {
        create: [
          {
            productId: products[1].id,
            quantity: 1,
            price: 380,
          },
        ],
      },
      statusHistory: {
        create: [
          { status: 'PENDING', note: 'Order placed' },
          { status: 'CONFIRMED', note: 'Order confirmed' },
          { status: 'PREPARING', note: 'Preparing' },
          { status: 'READY_FOR_PICKUP', note: 'Ready for pickup' },
          { status: 'PICKED_UP', note: 'Picked up by rider' },
          { status: 'OUT_FOR_DELIVERY', note: 'On the way' },
        ],
      },
    },
  });
  console.log('Created OUT_FOR_DELIVERY order:', outForDeliveryOrder.orderNumber);

  console.log('\n✅ Seeding complete!');
  console.log('Available orders: 3 (READY_FOR_PICKUP)');
  console.log('Active deliveries: 2 (1 PICKED_UP, 1 OUT_FOR_DELIVERY)');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
