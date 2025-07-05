// app/api/estimate/route.ts

import { NextResponse } from 'next/server'
import { dbPromise }    from '../../lib/db'

const FACTOR_G_PER_MB = 0.81
const EU_ADJUST      = 0.9

export async function POST(req: Request) {
  // 1. Récupération de la clé
  const apiKey = req.headers.get('authorization')?.split(' ')[1]
  if (!apiKey) {
    return NextResponse.json({ error: 'No API key' }, { status: 401 })
  }

  // 2. Lecture du payload
  const { bytes, region = 'WORLD' } = await req.json()
  if (typeof bytes !== 'number') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  // 3. Vérification du quota
  const db  = await dbPromise
  const row = await db.get(`SELECT used FROM keys WHERE api_key = ?`, apiKey)
  const used = row?.used ?? 0
  const quota = Number(process.env.QUOTA || 1000)
  if (used >= quota) {
    return NextResponse.json({ error: 'Quota exceeded' }, { status: 402 })
  }

  // 4. Calcul des émissions (en kg CO₂)
  const factor = FACTOR_G_PER_MB * (region === 'EU' ? EU_ADJUST : 1)
  const kgCO2  = (bytes / 1e6) * factor / 1000

  // 5. Incrémentation de l’usage
  await db.run(`UPDATE keys SET used = used + 1 WHERE api_key = ?`, apiKey)

  // 6. Réponse
  return NextResponse.json({ kgCO2 })
}