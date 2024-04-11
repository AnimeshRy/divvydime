'use client'

import React from 'react'
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

// import {AcmeLogo} from "./AcmeLogo.jsx";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const pathName = usePathname()

  const navigation = [
    {
      name: 'Groups',
      link: '#',
      icon: false,
    },
    {
      name: 'Features',
      link: '#',
      icon: false,
    },
    {
      name: 'Source',
      link: '#',
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
          {/* <AcmeLogo /> */}
          <p className="font-bold text-inherit">DivyDime</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarBrand>
          {/* <AcmeLogo /> */}
          <p className="font-bold text-inherit">DivyDime</p>
        </NavbarBrand>

        {navigation.map((item, index) => {
          return (
            <NavbarItem key={`${item.name}-${index}`} isActive>
              <div className="flex">
                <Link color="foreground" href="#" size="lg">
                  {item.name}
                </Link>
                {item.icon && item.icon}
              </div>
            </NavbarItem>
          )
        })}
      </NavbarContent>

      <NavbarContent justify="end">
        {pathName === '/' && (
          <NavbarItem className="hidden lg:flex">
            <Button>
              <Link href="/groups/create" color="foreground">
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
        {navigation.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <div className="flex">
              <Link className="w-full" href="#" color="foreground" size="lg">
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
