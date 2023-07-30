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
      </head>
      <body>
        <Provider store={store}>
          <SessionProvider>
            <Toaster />
            <ActiveStatus />
            {children}
          </SessionProvider>
        </Provider>
      </body>
    </html>
  )
}
