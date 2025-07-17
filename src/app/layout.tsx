import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CifrasDelMundo.com - Preguntas Numéricas',
  description: 'Descubre el mundo a través de números. Juego de trivia con preguntas que siempre se responden con cifras. ¿Cuánto sabes sobre el mundo en números?',
  keywords: 'trivia, números, cifras, preguntas, conocimiento, curiosidades, datos, estadísticas, mundo',
  authors: [{ name: 'CifrasDelMundo.com' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://cifrasdelmundo.com/',
    title: 'CifrasDelMundo.com - Preguntas Numéricas',
    description: 'Descubre el mundo a través de números. Juego de trivia con preguntas que siempre se responden con cifras.',
    images: ['https://cifrasdelmundo.com/favicon.png'],
  },
  twitter: {
    card: 'summary_large_image',
    url: 'https://cifrasdelmundo.com/',
    title: 'CifrasDelMundo.com - Preguntas Numéricas',
    description: 'Descubre el mundo a través de números. Juego de trivia con preguntas que siempre se responden con cifras.',
    images: ['https://cifrasdelmundo.com/favicon.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
} 