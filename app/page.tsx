'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [quota, setQuota]       = useState<{used:number;quota:number} | null>(null)
  const [bytes, setBytes]   = useState<number>(0);
  const [region, setRegion] = useState<'WORLD'|'EU'>('WORLD');
  const [result, setResult] = useState<number|null>(null);
  const [error, setError]   = useState<string>('');

  // ← 1) Au montage, on tente de récupérer la clé, sinon on la demande
  useEffect(() => {
  let stored = localStorage.getItem('API_KEY') || ''
  if (!stored) {
    stored = prompt('Entrez votre API Key :') || ''
    if (stored) localStorage.setItem('API_KEY', stored)
  }
  setApiKey(stored)

  if (stored) {
    fetch('/api/quota', {
      headers: { Authorization: `Bearer ${stored}` }
    })
      .then(res => res.json())
      .then(json => setQuota(json))
      .catch(() => {/* ignore */})
  }
}, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResult(null);

    // ← 2) On vérifie qu'on a bien une clé
    if (!apiKey) {
      setError('Clé API non trouvée.');
      return;
    }

    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ bytes, region })
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Erreur inconnue');
      }
      setResult(json.kgCO2);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <main className="p-8 max-w-md mx-auto">

      {/* Logo centré */}
      {/* <div className="mb-6 text-center"> */}
        <div className="mb-6 text-left">
        <img
          src="/carbonmeterapitrack.png"
          alt="CarbonMeter API Track logo"
          // className="mx-auto h-16 w-auto"
          width={250}// largeur en px 128
          height={250}// hauteur en px
          // priority // charge en priorité
          className='object-contain mx-auto'
        />
      </div>

      <h1 className="text-2xl font-bold mb-4">Estim’CO₂</h1>

      {quota && (
      <p className="mb-4 text-sm text-gray-600">
        Quota utilisé : {quota.used} / {quota.quota}
      </p>
    )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Taille (bytes)</label>
          <input
            type="number"
            value={bytes}
            onChange={e => setBytes(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Région</label>
          <select
            value={region}
            onChange={e => setRegion(e.target.value as 'WORLD'|'EU')}
            className="w-full p-2 border rounded"
          >
            <option value="WORLD">Monde</option>
            <option value="EU">Europe</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          Estimer
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">Erreur : {error}</p>}

      {result !== null && (
        <p className="mt-4 text-green-700">
          <strong>{result.toFixed(6)} kg</strong> de CO₂ estimés
        </p>
      )}
    </main>
  );
}