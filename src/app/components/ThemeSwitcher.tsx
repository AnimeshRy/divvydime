'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { RxSun, RxMoon } from 'react-icons/rx'
import { Button } from '@nextui-org/react'

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button onClick={toggleTheme} className="min-w-2">
      {theme === 'dark' ? <RxSun /> : <RxMoon />}
    </Button>
  )
}
