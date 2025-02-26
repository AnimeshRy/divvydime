'use client'

import React from 'react'
import Image from 'next/image'
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from '@nextui-org/react'
import { RxGithubLogo } from 'react-icons/rx'
import ThemeSwitcher from '../ThemeSwitcher'
import { usePathname } from 'next/navigation'
import { EXTERNAL_ROUTES, NAVIGATION_ROUTES } from '../../app/constants/routes'

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const pathName = usePathname()

  const homeNavigation = [
    {
      name: 'Groups',
      link: NAVIGATION_ROUTES.LIST_GROUPS,
      icon: false,
    },
    {
      name: 'Features',
      link: NAVIGATION_ROUTES.FEATURES,
      icon: false,
    },
    {
      name: 'Source',
      link: EXTERNAL_ROUTES.GITHUB_REPO,
      icon: <RxGithubLogo fontSize="1.2rem" className="ml-2 mt-1" />,
    },
  ]

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Image
            src="/logo-logo.png"
            alt="DivyDime Logo"
            width={32}
            height={32}
            className="mr-4"
          />
          <Link className="font-bold text-inherit" href="/">
            DivyDime
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarBrand>
          <Image
            src="/logo-logo.png"
            alt="DivyDime Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <Link className="font-bold text-inherit" href="/">
            DivyDime
          </Link>
        </NavbarBrand>

        {homeNavigation.map((item, index) => {
          return (
            <NavbarItem key={`${item.name}-${index}`} isActive>
              <div className="flex">
                <Link color="foreground" href={item.link} size="lg">
                  {item.name}
                </Link>
                {item.icon && item.icon}
              </div>
            </NavbarItem>
          )
        })}
      </NavbarContent>

      <NavbarContent justify="end">
        {pathName !== NAVIGATION_ROUTES.CREATE_GROUP && (
          <NavbarItem className="hidden lg:flex">
            <Button>
              <Link href={NAVIGATION_ROUTES.CREATE_GROUP} color="foreground">
                Create Group
              </Link>
            </Button>
          </NavbarItem>
        )}
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {pathName === '/' &&
          homeNavigation.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <div className="flex">
                <Link
                  className="w-full"
                  href={item.link}
                  color="foreground"
                  size="lg"
                >
                  {item.name}
                </Link>
                {item.icon && item.icon}
              </div>
            </NavbarMenuItem>
          ))}
      </NavbarMenu>
    </Navbar>
  )
}
