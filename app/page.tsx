"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [quota, setQuota] = useState<{ used: number; quota: number } | null>(
    null
  );
  const [bytes, setBytes] = useState<number>(0);
  const [region, setRegion] = useState<"WORLD" | "EU">("WORLD");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<
    { bytes: number; region: "WORLD" | "EU"; result: number; date: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // 1) Clé API
    let stored = localStorage.getItem("API_KEY") || "";
    if (!stored) {
      stored = prompt("Entrez votre API Key :") || "";
      if (stored) localStorage.setItem("API_KEY", stored);
    }
    setApiKey(stored);

    // 2) Quota
    if (stored) {
      fetch("/api/quota", { headers: { Authorization: `Bearer ${stored}` } })
        .then((res) => res.json())
        .then((json) => setQuota(json))
        .catch(() => {});
    }

    // 3) Historique
    const saved = localStorage.getItem("HISTORY");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!apiKey) {
      setError("Clé API non trouvée.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ bytes, region }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur inconnue");

      setResult(json.kgCO2);
      const entry = {
        bytes,
        region,
        result: json.kgCO2,
        date: new Date().toLocaleTimeString(),
      };
      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, 5);
        localStorage.setItem("HISTORY", JSON.stringify(next));
        return next;
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-4 px-4 max-w-lg mx-auto">
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/carbonmeterapitrack.png"
          alt="Logo CarbonMeter API Track"
          width={220}
          height={220}
          className="object-contain"
          priority
        />
      </div>

      <h1 className="text-3xl font-bold mb-2 text-center">
        Estim’CO₂ Chaque octet compte : réduisez votre impact carbone en un clic
      </h1>
      {/* <p className="text-center text-lg text-green-600 mb-4">
        Chaque octet compte : réduisez votre impact carbone en un clic
      </p> */}
      {quota && (
        <p className="mb-6 text-sm text-gray-600 text-center">
          Quota utilisé : {quota.used} / {quota.quota}
        </p>
      )}

      {/* Layout responsive 2 colonnes */}
      <div className="md:grid md:grid-cols-2 md:gap-6">
        {/* Carte Formulaire + Résultat */}
        <div className="bg-white p-6 rounded-lg shadow mb-6 md:mb-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Taille (bytes)</label>
              <input
                type="number"
                min={0}
                value={bytes}
                onChange={(e) => setBytes(Number(e.target.value))}
                className="w-full p-2 border rounded"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1">Région</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as "WORLD" | "EU")}
                className="w-full p-2 border rounded"
                disabled={loading}
              >
                <option value="WORLD">Monde</option>
                <option value="EU">Europe</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white rounded ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Chargement…" : "Estimer"}
            </button>
          </form>

          {error && <p className="mt-4 text-red-600">Erreur : {error}</p>}
          {result !== null && (
            <p className="mt-4 text-green-700">
              <strong>{result.toFixed(6)} kg</strong> de CO₂ estimés
            </p>
          )}
        </div>

        {/* Carte Historique */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-lg font-semibold mb-2">Historique</h2>
          {history.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune estimation</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {history.map((e, i) => (
                <li key={i}>
                  <span className="font-medium">[{e.date}]</span>{" "}
                  {e.bytes.toLocaleString()} bytes (
                  {e.region === "EU" ? "Europe" : "Monde"}) →{" "}
                  <span className="text-green-700">
                    {e.result.toFixed(6)} kg
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
