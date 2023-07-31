'use client'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import './globals.css'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import ActiveStatus from './components/ActiveStatus'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        <title>Talks Messanger</title>
        <link rel="icon" href='/logo.png' />
        <meta
          name="description"
          content="A Real Time Chat Application Where User can do text based conversation, can send or receive images, and can do a group conversation"
        />
        <link rel="apple-touch-icon" href="/logo.png" />

      </head>
      <body>
        <Provider store={store}>
          <SessionProvider>
            <ActiveStatus />
            <Toaster />
            {children}
          </SessionProvider>
        </Provider>
      </body>
    </html>
  )
}
