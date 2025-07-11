// app/layout.tsx
import "./ui/global.css";
import { ThemeRegistry } from "./providers/ThemeRegistry";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // on ajoute suppressHydrationWarning par sécurité
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
