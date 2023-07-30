'use client'
import React, { useEffect } from 'react'
import EmptyState from '../components/EmptyState'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setUserMode } from '../redux/user/slice'

const page = () => {
  const { mode } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!localStorage.mode) {
        localStorage.setItem("mode", "light")
        dispatch(setUserMode("light"))
    } else {
        dispatch(setUserMode(localStorage.getItem("mode") || ""))
    }
  }, [dispatch])
  return (
    <>
      <div className={`hidden h-full md:pl-80 md:block`}>
        {mode && <EmptyState mode={mode}/>}
      </div>
    </>
  )
}

export default page
