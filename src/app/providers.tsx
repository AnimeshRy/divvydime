'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider
        defaultTheme="dark"
        attribute="class"
        themes={['dark', 'light', 'system']}
        enableSystem={true}
      >
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  )
}
