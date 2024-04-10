import { NextPage } from 'next'
import Hero from '@/components/hero'

const CreateGroup: NextPage = () => {
  return (
    <div>
      <section className="flex justify-center items-center gap-4 mt-16 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1>Try&nbsp;</h1>
          <h1>DivyDime&nbsp;!</h1>
          <br />
          <h1>OpenSource SplitWise Alternative</h1>
          <h2>Clean, Fast and Runs in the Browser!</h2>
        </div>
      </section>
    </div>
  )
}

export default CreateGroup
