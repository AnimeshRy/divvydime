import { NextPage } from 'next'
import Nav from './components/navbar/navbar'
import Hero from './components/hero'

const HomePage: NextPage = () => {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  )
}

export default HomePage
