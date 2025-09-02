"use client"
import { Button } from '@/components/ui/button'
import { SignInButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import path from 'path'
import React from 'react'

const menuOptions=[
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Pricing',
    path: '/pricing'
  },
  {
    name:'Contact Us',
    path: '/contact'
  }
]
function Header() {

  const { user } = useUser();
  return (
    <div className='flex justify-between items-center p-4'>
      {/* Logo */}
      <h1 className='text-2xl font-bold'>🚆 Journyzer</h1>
      {/* Menu Section  */}
      <div className='flex gap-8 items-center'>
        {menuOptions.map((menu, index) => (
          <Link key={menu.name} href={menu.path}>
            <h2 className='text-lg hover:scale-105 transition-all hover:text-primary'>{menu.name}</h2>
          </Link>
        ))}
      </div>

      {/* Get Started Button */}
      {!user ? (
        <SignInButton mode='modal'>
          <Button>Get Started</Button>
        </SignInButton>
      ) : (
        <Link href={'/create-new-trip'}>
          <Button>Create New Trip</Button>
        </Link>
      )}

    </div>
  )
}

export default Header