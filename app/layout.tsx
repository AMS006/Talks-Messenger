import { Toaster } from 'react-hot-toast'
import { Metadata } from 'next'

import ActiveStatus from '@/components/ActiveStatus'
import StoreProvider from '@/components/provider'
import './globals.css'
import { NextAuthProvider } from '@/components/nextSession'

export const metadata: Metadata = {
  title: 'Talks Messanger',
  description: 'A Real Time Chat Application Where User can do text based conversation',
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" href='/logo.png' />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body>
        <StoreProvider>
          <NextAuthProvider>
            <ActiveStatus />
            <Toaster />
            {children}
          </NextAuthProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
