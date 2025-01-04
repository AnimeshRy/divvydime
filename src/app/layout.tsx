import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import Nav from '@/components/navbar/navbar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DivyDime',
  description: 'DivyDime: SplitWise Alternative',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Nav />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
