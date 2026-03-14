import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SafePath AI | Intelligent Women Safety Navigation',
  description: 'AI-powered routing and community safety network for women.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
