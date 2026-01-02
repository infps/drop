import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function processWithdrawals() {
  console.log('Finding pending withdrawals...\n');

  const pendingWithdrawals = await prisma.riderWithdrawal.findMany({
    where: {
      status: { in: ['PENDING', 'PROCESSING'] },
    },
    include: {
      rider: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
    orderBy: { requestedAt: 'asc' },
  });

  if (pendingWithdrawals.length === 0) {
    console.log('No pending withdrawals found.');
    return;
  }

  console.log(`Found ${pendingWithdrawals.length} pending withdrawal(s):\n`);

  for (const withdrawal of pendingWithdrawals) {
    console.log(`------------------------------------------`);
    console.log(`ID: ${withdrawal.id}`);
    console.log(`Rider: ${withdrawal.rider.name} (${withdrawal.rider.phone})`);
    console.log(`Amount: ₹${withdrawal.amount}`);
    console.log(`Status: ${withdrawal.status}`);
    console.log(`Bank: ****${withdrawal.bankAccount.slice(-4)} (${withdrawal.ifscCode})`);
    console.log(`Requested: ${withdrawal.requestedAt.toLocaleString()}`);
    console.log(`------------------------------------------\n`);
  }

  // Process all pending withdrawals
  console.log('Processing all pending withdrawals...\n');

  for (const withdrawal of pendingWithdrawals) {
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await prisma.riderWithdrawal.update({
      where: { id: withdrawal.id },
      data: {
        status: 'COMPLETED',
        processedAt: new Date(),
        completedAt: new Date(),
        transactionId,
      },
    });

    console.log(`✓ Completed withdrawal ${withdrawal.id}`);
    console.log(`  Transaction ID: ${transactionId}`);
    console.log(`  Amount: ₹${withdrawal.amount} -> ${withdrawal.rider.name}\n`);
  }

  console.log(`\nSuccessfully processed ${pendingWithdrawals.length} withdrawal(s).`);
}

processWithdrawals()
  .catch((e) => {
    console.error('Error processing withdrawals:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
