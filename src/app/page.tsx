import { NextPage } from 'next'
import Hero from '@/components/hero'
import { Toaster } from 'react-hot-toast'

const HomePage: NextPage = () => {
  return (
    <>
      <Toaster position="top-right" />
      <main>
        <Hero />
      </main>
    </>
  )
}

export default HomePage
