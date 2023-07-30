'use client'
import React from 'react'

const EmptyState = ({mode}:{mode:string}) => {
  
  return (
    <div className={`md:flex hidden  border-l border-b-light1 justify-center items-center transition-colors duration-300 ease-in-out h-full ${mode && mode === 'light' ? 'bg-light-1 text-black' : 'bg-dark-1 text-white'}`}>
      <p className='w-full text-center font-semibold'>
        Select a Chat or start a New Conversations with User
      </p>
    </div>
  )
}

export default EmptyState