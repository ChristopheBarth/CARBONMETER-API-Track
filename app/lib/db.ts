// lib/db.ts
import sqlite3 from 'sqlite3'
import { open, type Database } from 'sqlite'
import 'dotenv/config'                   // charge ton .env.local en dev

// On exporte une promesse de connexion que l’on réutilisera partout
export const dbPromise: Promise<Database> = (async () => {
  const db = await open({
    filename: './data.sqlite',
    driver: sqlite3.Database,
  })
  // création de la table des clés si elle n'existe pas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS keys (
      api_key TEXT PRIMARY KEY,
      used   INTEGER NOT NULL DEFAULT 0
    );
  `)
  return db
})()
