import bcrypt from 'bcrypt'
import { sign } from 'hono/jwt'

const SALT_ROUNDS = 10
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-min-32-chars-long'
const JWT_EXPIRY = '24h'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function generateToken(payload: { id: string; role: string }): Promise<string> {
  return sign({ ...payload, exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 }, JWT_SECRET)
}
