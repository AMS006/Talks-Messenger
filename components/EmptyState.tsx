'use client'
import React from 'react'

import { useAppSelector } from '../redux/hooks'
import logo from '../public/logo.png'
import Image from 'next/image'

const EmptyState = () => {

  const { mode } = useAppSelector((state) => state.user)
  return (
    <div className={`md:flex flex-col hidden  border-l border-b-light1 justify-center items-center transition-colors duration-300 ease-in-out h-full ${mode && mode === 'light' ? 'bg-light-1 text-black' : 'bg-dark-1 text-white'}`}>
      <Image src={logo} alt="logo" width={48} height={48} />
      <h3 className='text-center font-semibold text-xl'>Welcome To Talks Messenger</h3>
      <p className='w-full text-center'>
        Select a Chat or start a New Conversations with User
      </p>
    </div>
  )
}

export default EmptyState