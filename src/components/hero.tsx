import { NextComponentType } from 'next'
import { Code, Divider, Link, Snippet } from '@nextui-org/react'
import { button as buttonStyles } from '@nextui-org/theme'
import React from 'react'
import { subtitle, title } from './primitives'
import { RxGithubLogo } from 'react-icons/rx'

const Hero: NextComponentType = () => {
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 mt-5 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Try&nbsp;</h1>
          <h1 className={title({ color: 'green' })}>DivyDime&nbsp;!</h1>
          <br />
          <h1 className={title()}>OpenSource SplitWise Alternative</h1>
          <h2 className={subtitle({ class: 'mt-4' })}>
            Clean, Fast and Runs in the Browser!
          </h2>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            href="#"
            className={buttonStyles({
              color: 'success',
              radius: 'full',
              variant: 'shadow',
            })}
          >
            Create Group
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: 'bordered', radius: 'full' })}
            href="#"
          >
            <RxGithubLogo size={20} />
            GitHub
          </Link>
        </div>
      </section>
      <Divider />
    </>
  )
}

export default Hero
