// app/api/key/route.ts
import { randomBytes } from 'crypto'
import { NextResponse } from 'next/server'
import { dbPromise }    from '../../lib/db'

export async function GET() {
  const db     = await dbPromise
  const apiKey = randomBytes(16).toString('hex')
  await db.run(`INSERT INTO keys(api_key) VALUES(?)`, apiKey)
  return NextResponse.json({ apiKey })
}