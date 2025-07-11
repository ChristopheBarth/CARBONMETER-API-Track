"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { Roboto } from "next/font/google";
import React from "react";

// ⚡️ On instancie 2 variantes de Roboto :
const roboto700 = Roboto({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});
const roboto400 = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export function Header() {
  const { theme } = useTheme();

  // on prépare la couleur en fonction du thème
  const textColor = theme === "dark" ? "text-white" : "text-black";
  const subColor = theme === "dark" ? "text-gray-300" : "text-gray-600";

  return (
    // <header className="flex items-center space-x-3 py-4 px-4">
    <header className="flex items-center px-4 py-4">
      <Image
        src="/customers/carbon-icon.png"
        alt="Icône CarbonMeter Track"
        width={80}
        height={80}
        priority
      />
      {/* C’est ici qu’on applique Roboto */}
      <div className="ml-3">
        {/* On applique Roboto700 au mot “CARBON” */}
        <h1 className={`text-2xl leading-tight ${textColor}`}>
          <span className={roboto700.className}>CARBON</span>{" "}
          {/* Roboto400 au reste */}
          <span className={`${roboto400.className}`}>METER API</span>
        </h1>

        <p className="text-sm uppercase tracking-widest text-[#00adef]">
          Track
        </p>
      </div>
    </header>
  );
}
