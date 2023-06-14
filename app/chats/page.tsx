'use client'
import React, { useEffect } from 'react'
import EmptyState from '../components/EmptyState'
import axios from 'axios'
import { useAppSelector } from '../redux/hooks'


const page = () => {
  const { user} = useAppSelector((state) => state.user)
  useEffect(() => {

    async function fetchConversation() {
      await axios.get('/api/conversation').then((data) => {
      })
    }
    if (user)
      fetchConversation()
  }, [user])

  return (
    <>
      <div className={`hidden h-full md:pl-80 md:block`}>
        <EmptyState />
      </div>
    </>
  )
}

export default page
