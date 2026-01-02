import { db } from './src/db'
import { admins } from './src/db/schema'
import { hashPassword } from './src/helpers/auth.helper'
import { eq } from 'drizzle-orm'

async function seed() {
  console.log('Seeding database...')

  const testAdmin = {
    email: 'admin@test.com',
    password: 'Test123!',
    name: 'Test Admin',
    role: 'SUPER_ADMIN' as const,
  }

  // Check if admin exists
  const [existing] = await db
    .select()
    .from(admins)
    .where(eq(admins.email, testAdmin.email))
    .limit(1)

  if (existing) {
    console.log('Admin already exists, skipping...')
    return
  }

  // Hash password
  const hashedPassword = await hashPassword(testAdmin.password)

  // Insert admin
  await db.insert(admins).values({
    email: testAdmin.email,
    password: hashedPassword,
    name: testAdmin.name,
    role: testAdmin.role,
  })

  console.log('Admin created:', testAdmin.email)
  console.log('Password:', testAdmin.password)
}

seed()
  .then(() => {
    console.log('Seed complete')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
