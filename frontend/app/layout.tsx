import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinkedIn Post Generator',
  description: 'Post Generator for LinkedIn',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
