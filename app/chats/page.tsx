import React from 'react'
import EmptyState from '@/components/EmptyState'

const Page = () => {

  return (
    <>
      <div className={`hidden h-full md:pl-80 md:block`}>
        <EmptyState />
      </div>
    </>
  )
}

export default Page
