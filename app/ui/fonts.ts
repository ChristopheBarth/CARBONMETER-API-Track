// app/ui/fonts.ts
import { Roboto } from 'next/font/google'

export const roboto = Roboto({
  subsets: ['latin'],           // sous-jeu de caractères
  weight: ['400', '700'],       // poids normal + bold
  variable: '--font-roboto',    // nom de la variable CSS
  display: 'swap',
})