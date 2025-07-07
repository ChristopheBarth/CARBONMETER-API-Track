import { NextResponse } from 'next/server'
import { dbPromise }    from '../../lib/db'

export async function GET(req: Request) {
  const apiKey = req.headers.get('authorization')?.split(' ')[1]
  if (!apiKey) {
    return NextResponse.json({ error: 'No API key' }, { status: 401 })
  }

  const db  = await dbPromise
  const row = await db.get(
    `SELECT used FROM keys WHERE api_key = ?`,
    apiKey
  )
  const used  = row?.used ?? 0
  const quota = Number(process.env.QUOTA || 1000)

  return NextResponse.json({ used, quota })
}