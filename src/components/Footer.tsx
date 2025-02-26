'use client'

import React from 'react'
import { Link } from '@nextui-org/react'
import Image from 'next/image'
import { RxGithubLogo } from 'react-icons/rx'
import { FaXTwitter, FaLinkedin } from 'react-icons/fa6'
import { EXTERNAL_ROUTES, NAVIGATION_ROUTES } from '../app/constants/routes'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#' },
        { name: 'Groups', href: NAVIGATION_ROUTES.LIST_GROUPS },
        { name: 'Create Group', href: NAVIGATION_ROUTES.CREATE_GROUP },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'Help Center', href: '#' },
        { name: 'Privacy Policy', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#' },
        { name: 'Contact', href: '#' },
        { name: 'Careers', href: '#' },
      ],
    },
  ]

  const socialLinks = [
    {
      name: 'GitHub',
      href: EXTERNAL_ROUTES.GITHUB_REPO,
      icon: <RxGithubLogo className="text-xl" aria-hidden="true" />
    },
    {
      name: 'Twitter',
      href: '#',
      icon: <FaXTwitter className="text-xl" aria-hidden="true" />
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: <FaLinkedin className="text-xl" aria-hidden="true" />
    },
  ]

  const handleKeyDown = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      window.location.href = href
    }
  }

  return (
    <footer className="w-full mt-auto relative">
      {/* Stylish gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
      <div className="py-8 md:py-12 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo and description */}
          <div className="flex flex-col space-y-4 lg:col-span-2">
            <div className="flex items-center">
              <Image
                src="/logo-logo.png"
                alt="DivyDime Logo"
                width={32}
                height={32}
                className="mr-2"
              />
              <span className="font-bold text-lg">DivyDime</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              DivyDime helps you split expenses with friends and family.
              Track group expenses, settle debts, and manage your finances together.
            </p>
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-gray-500 hover:text-primary transition-colors"
                  aria-label={social.name}
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, social.href)}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((category) => (
            <div key={category.title} className="space-y-4">
              <h4 className="text-sm font-semibold">{category.title}</h4>
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-primary transition-colors"
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, link.href)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 relative">
          {/* Subtle inner border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {currentYear} DivyDime. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link
                href="#"
                className="text-xs text-gray-500 hover:text-primary transition-colors"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, '#')}
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-xs text-gray-500 hover:text-primary transition-colors"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, '#')}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-xs text-gray-500 hover:text-primary transition-colors"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, '#')}
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
