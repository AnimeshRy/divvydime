/* eslint-disable react/no-unescaped-entities */
import { NextComponentType } from 'next'
import {
  Link,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Chip,
  Button,
  Avatar,
  Tooltip,
} from '@nextui-org/react'
import { button as buttonStyles } from '@nextui-org/theme'
import React from 'react'
import { subtitle, title } from './primitives'

import { RxGithubLogo } from 'react-icons/rx'
import { EXTERNAL_ROUTES, NAVIGATION_ROUTES } from '../app/constants/routes'
import {
  FaMoneyBillWave,
  FaUserFriends,
  FaLock,
  FaMobileAlt,
} from 'react-icons/fa'
import { MdOutlineSpeed, MdDarkMode } from 'react-icons/md'

const Hero: NextComponentType = () => {
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 mt-16 py-8 md:py-10">
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
            href={NAVIGATION_ROUTES.CREATE_GROUP}
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
            href={EXTERNAL_ROUTES.GITHUB_REPO}
          >
            <RxGithubLogo size={20} />
            GitHub
          </Link>
        </div>
      </section>

      {/* Group Chat Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={title({ size: 'sm' })}>
            Tired of Complicated Expense Tracking?
          </h2>
          <p className={subtitle({ class: 'mt-4 max-w-2xl mx-auto' })}>
            We've all been there. Group trips, dinners, and shared expenses can
            get messy.
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardBody className="p-0">
            {/* Chat Header */}
            <div className="bg-success/10 p-4 flex items-center gap-3 border-b border-divider">
              <div className="flex items-center gap-3">
                <Avatar
                  src="https://i.pravatar.cc/150?u=goatrip"
                  className="bg-success/20"
                  size="md"
                />
                <div>
                  <h3 className="text-lg font-bold">Goa Trip 💸</h3>
                  <p className="text-xs text-default-500">6 participants</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 space-y-4 bg-gradient-to-b from-default-50/50 to-default-100/50 min-h-[400px]">
              {/* Message 1 */}
              <div className="flex gap-3 items-start">
                <Tooltip content="Rahul">
                  <Avatar src="https://i.pravatar.cc/150?u=rahul" size="sm" />
                </Tooltip>
                <div className="bg-default-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">
                    Hey guys, what's the remaining amount I need to pay?
                  </p>
                  <span className="text-xs text-default-400 mt-1 block">
                    10:32 AM
                  </span>
                </div>
              </div>

              {/* Message 2 */}
              <div className="flex gap-3 items-start">
                <Tooltip content="Priya">
                  <Avatar src="https://i.pravatar.cc/150?u=priya" size="sm" />
                </Tooltip>
                <div className="bg-default-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">
                    It's very hard to track now. We've had so many expenses over
                    the last 3 days.
                  </p>
                  <span className="text-xs text-default-400 mt-1 block">
                    10:33 AM
                  </span>
                </div>
              </div>

              {/* Message 3 */}
              <div className="flex gap-3 items-start">
                <Tooltip content="Arjun">
                  <Avatar src="https://i.pravatar.cc/150?u=arjun" size="sm" />
                </Tooltip>
                <div className="bg-default-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">
                    I think you owe me ₹1200 for the taxi and dinner, but I'm
                    not sure about the rest.
                  </p>
                  <span className="text-xs text-default-400 mt-1 block">
                    10:34 AM
                  </span>
                </div>
              </div>

              {/* Message 4 */}
              <div className="flex gap-3 items-start">
                <Tooltip content="Neha">
                  <Avatar src="https://i.pravatar.cc/150?u=neha" size="sm" />
                </Tooltip>
                <div className="bg-default-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">
                    Splitwise is paid, what's the alternative? I don't want to
                    pay for an app just to split expenses.
                  </p>
                  <span className="text-xs text-default-400 mt-1 block">
                    10:36 AM
                  </span>
                </div>
              </div>

              {/* Message 5 */}
              <div className="flex gap-3 items-start">
                <Tooltip content="Vikram">
                  <Avatar src="https://i.pravatar.cc/150?u=vikram" size="sm" />
                </Tooltip>
                <div className="bg-default-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">
                    Why don't we use DivyDime? It's free, open-source, and works
                    right in the browser.
                  </p>
                  <span className="text-xs text-default-400 mt-1 block">
                    10:38 AM
                  </span>
                </div>
              </div>

              {/* Message 6 */}
              <div className="flex gap-3 items-start">
                <Tooltip content="Meera">
                  <Avatar src="https://i.pravatar.cc/150?u=meera" size="sm" />
                </Tooltip>
                <div className="bg-success/20 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">
                    Just created a group on DivyDime! It's so easy to use and we
                    can all see who owes what in real-time.
                  </p>
                  <span className="text-xs text-default-400 mt-1 block">
                    10:40 AM
                  </span>
                </div>
              </div>

              {/* Message 7 */}
              <div className="flex gap-3 items-start">
                <Tooltip content="Rahul">
                  <Avatar src="https://i.pravatar.cc/150?u=rahul" size="sm" />
                </Tooltip>
                <div className="bg-default-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">
                    Perfect! This is exactly what we needed. Let's add all our
                    expenses there.
                  </p>
                  <span className="text-xs text-default-400 mt-1 block">
                    10:41 AM
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Input - Just for show */}
            <div className="p-4 border-t border-divider">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-full bg-default-100 text-sm"
                  placeholder="Type a message..."
                  disabled
                />
                <Button
                  isIconOnly
                  color="success"
                  variant="flat"
                  radius="full"
                  aria-label="Send message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                  </svg>
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto" id="features">
        <div className="text-center mb-16">
          <h2 className={title({ size: 'sm' })}>
            Why Choose{' '}
            <span className={title({ color: 'green', size: 'sm' })}>
              DivyDime
            </span>
            ?
          </h2>
          <p className={subtitle({ class: 'mt-4 max-w-2xl mx-auto' })}>
            Split expenses with friends and family without the hassle. DivyDime
            makes it easy to track, manage, and settle up.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="border-none hover:shadow-lg transition-shadow">
            <CardBody className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-success/10 text-success">
                  <FaMoneyBillWave size={24} />
                </div>
                <h3 className="text-xl font-semibold">
                  Easy Expense Splitting
                </h3>
              </div>
              <p className="text-default-500">
                Split expenses evenly, by percentage, shares, or exact amounts.
                Perfect for roommates, trips, or group dinners.
              </p>
            </CardBody>
            <Divider />
            <CardFooter className="gap-2 flex-wrap">
              <Chip color="success" variant="flat" size="sm">
                Flexible
              </Chip>
              <Chip color="success" variant="flat" size="sm">
                Customizable
              </Chip>
            </CardFooter>
          </Card>

          {/* Card 2 */}
          <Card className="border-none hover:shadow-lg transition-shadow">
            <CardBody className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-success/10 text-success">
                  <FaUserFriends size={24} />
                </div>
                <h3 className="text-xl font-semibold">Group Management</h3>
              </div>
              <p className="text-default-500">
                Create multiple groups for different occasions. Invite friends,
                track balances, and settle up with ease.
              </p>
            </CardBody>
            <Divider />
            <CardFooter className="gap-2 flex-wrap">
              <Chip color="success" variant="flat" size="sm">
                Collaborative
              </Chip>
              <Chip color="success" variant="flat" size="sm">
                Organized
              </Chip>
            </CardFooter>
          </Card>

          {/* Card 3 */}
          <Card className="border-none hover:shadow-lg transition-shadow">
            <CardBody className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-success/10 text-success">
                  <FaLock size={24} />
                </div>
                <h3 className="text-xl font-semibold">Privacy Focused</h3>
              </div>
              <p className="text-default-500">
                Your data stays in your browser. No accounts required, no
                tracking, and completely open source.
              </p>
            </CardBody>
            <Divider />
            <CardFooter className="gap-2 flex-wrap">
              <Chip color="success" variant="flat" size="sm">
                Secure
              </Chip>
              <Chip color="success" variant="flat" size="sm">
                Open Source
              </Chip>
            </CardFooter>
          </Card>

          {/* Card 4 */}
          <Card className="border-none hover:shadow-lg transition-shadow">
            <CardBody className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-success/10 text-success">
                  <MdOutlineSpeed size={24} />
                </div>
                <h3 className="text-xl font-semibold">Lightning Fast</h3>
              </div>
              <p className="text-default-500">
                Built with modern web technologies for instant calculations and
                smooth user experience.
              </p>
            </CardBody>
            <Divider />
            <CardFooter className="gap-2 flex-wrap">
              <Chip color="success" variant="flat" size="sm">
                Responsive
              </Chip>
              <Chip color="success" variant="flat" size="sm">
                Optimized
              </Chip>
            </CardFooter>
          </Card>

          {/* Card 5 */}
          <Card className="border-none hover:shadow-lg transition-shadow">
            <CardBody className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-success/10 text-success">
                  <MdDarkMode size={24} />
                </div>
                <h3 className="text-xl font-semibold">Dark & Light Mode</h3>
              </div>
              <p className="text-default-500">
                Switch between dark and light themes to match your preference
                and reduce eye strain.
              </p>
            </CardBody>
            <Divider />
            <CardFooter className="gap-2 flex-wrap">
              <Chip color="success" variant="flat" size="sm">
                Customizable
              </Chip>
              <Chip color="success" variant="flat" size="sm">
                Accessible
              </Chip>
            </CardFooter>
          </Card>

          {/* Card 6 */}
          <Card className="border-none hover:shadow-lg transition-shadow">
            <CardBody className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-success/10 text-success">
                  <FaMobileAlt size={24} />
                </div>
                <h3 className="text-xl font-semibold">Mobile Friendly</h3>
              </div>
              <p className="text-default-500">
                Use DivyDime on any device. The responsive design works
                perfectly on phones, tablets, and desktops.
              </p>
            </CardBody>
            <Divider />
            <CardFooter className="gap-2 flex-wrap">
              <Chip color="success" variant="flat" size="sm">
                Responsive
              </Chip>
              <Chip color="success" variant="flat" size="sm">
                Cross-platform
              </Chip>
            </CardFooter>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-green-500/20 to-green-700/20 border-none py-8 px-4">
            <CardBody>
              <h3 className="text-2xl font-bold mb-4">
                Ready to split expenses with friends?
              </h3>
              <p className="text-default-600 mb-6 max-w-2xl mx-auto">
                Start using DivyDime today and make expense sharing simple,
                fair, and hassle-free.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  as={Link}
                  href={NAVIGATION_ROUTES.CREATE_GROUP}
                  color="success"
                  variant="shadow"
                  radius="full"
                  size="lg"
                >
                  Create Your First Group
                </Button>
                <Button
                  as={Link}
                  href={NAVIGATION_ROUTES.LIST_GROUPS}
                  variant="flat"
                  color="success"
                  radius="full"
                  size="lg"
                >
                  View Groups
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </>
  )
}

export default Hero
