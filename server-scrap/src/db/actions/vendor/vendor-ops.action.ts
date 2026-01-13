import { db } from '@/db'
import { vendors } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword } from '@/helpers/auth.helper'
import type { VendorCreate } from '@/types/vendor.types'
import type { VendorType } from '@/types/enums'

export async function createVendor(data: VendorCreate) {
  const hashedPassword = await hashPassword(data.password)

  const [vendor] = await db
    .insert(vendors)
    .values({
      name: data.name,
      description: data.description,
      type: data.type as VendorType,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      openingTime: data.openingTime,
      closingTime: data.closingTime,
      minimumOrder: data.minimumOrder || 0,
      commissionRate: data.commissionRate || 15,
      isVerified: false,
      isActive: false,
    })
    .returning()

  return vendor
}

export async function approveVendor(id: string) {
  const [vendor] = await db
    .update(vendors)
    .set({
      isVerified: true,
      isActive: true,
      updatedAt: new Date(),
    })
    .where(eq(vendors.id, id))
    .returning()

  return vendor
}

export async function rejectVendor(id: string) {
  const [vendor] = await db
    .update(vendors)
    .set({
      isVerified: false,
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(vendors.id, id))
    .returning()

  return vendor
}

export async function suspendVendor(id: string) {
  const [vendor] = await db
    .update(vendors)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(vendors.id, id))
    .returning()

  return vendor
}

export async function activateVendor(id: string) {
  const [vendor] = await db
    .update(vendors)
    .set({
      isActive: true,
      updatedAt: new Date(),
    })
    .where(eq(vendors.id, id))
    .returning()

  return vendor
}

export async function updateVendor(id: string, data: Partial<VendorCreate>) {
  const { type, ...rest } = data
  const [vendor] = await db
    .update(vendors)
    .set({
      ...rest,
      ...(type && { type: type as VendorType }),
      updatedAt: new Date(),
    })
    .where(eq(vendors.id, id))
    .returning()

  return vendor
}

export async function deleteVendor(id: string) {
  await db.delete(vendors).where(eq(vendors.id, id))
  return true
}
