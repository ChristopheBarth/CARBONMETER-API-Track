"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { Montserrat } from "next/font/google";
import React from "react";

// ⚡️ On instancie 2 variantes de Montserrat :
const montserrat700 = Montserrat({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});
const montserrat400 = Montserrat({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export function Header() {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "text-white" : "text-black";
  const subColor = "text-[#00adef]";

  return (
    <header className="flex items-start px-4 py-2">
      <Image
        src="/customers/carbon-icon.png"
        alt="Icône CarbonMeter Track"
        width={80}
        height={80}
        priority
      />

      <div className="ml-3">
        {/* 1) On colle CARBON et METER API */}
        <h1
          className={`
            text-2xl 
            leading-tight 
            ${textColor} 
            !mb-0        <!-- ZERO margin bottom -->
            tracking-tight  <!-- (optionnel) resserre les lettres -->
          `}
        >
          <span className={montserrat700.className}>CARBON</span>
          <span className={`${montserrat400.className}`}>METER API</span>
        </h1>

        {/* 2) On colle Track sous le titre */}
        <p
          className={`!-mt-0 text-sm uppercase tracking-widest ${subColor} mt-0`}
        >
          Track
        </p>
      </div>
    </header>
  );
}
