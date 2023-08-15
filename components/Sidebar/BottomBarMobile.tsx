'use client'
import Link from 'next/link'
import Avatar from 'react-avatar'
import { useParams, usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BsChatText } from 'react-icons/bs'
import { FaUserFriends } from 'react-icons/fa'
import { MdDarkMode, MdLightMode } from 'react-icons/md'
import Image from 'next/image'

import MyProfileBar from './MyProfileBar'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setMyProfileBar, setUserMode } from '@/redux/user/slice'
import { User } from '@prisma/client'

const BottomBarMobile = ({ user }: { user: User }) => {
  const path = usePathname()
  const { mode } = useAppSelector((state) => state.user)
  const sideBarItems = [
    {
      name: "Chats",
      path: '/chats',
      logo: <BsChatText size={30} />,
      active: path === '/chats'
    },
    {
      name: "Users",
      path: '/users',
      logo: <FaUserFriends size={30} />,
      active: path === '/users'
    },
  ]
  const toggleMode = (val: string) => {
    dispatch(setUserMode(val))
    localStorage.setItem("mode", val)
  }
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!localStorage.mode) {
      localStorage.setItem("mode", "light")
      dispatch(setUserMode("light"))
    } else {
      dispatch(setUserMode(localStorage.getItem("mode") || ""))
    }
  }, [dispatch])
  const params = useParams()
  const { myProfileBar } = useAppSelector((state) => state.user)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted)
    return null
  return (
    <>
      <div className='block md:hidden'>
        <MyProfileBar user={user} />
      </div>
      <div className={`md:hidden fixed flex bottom-0 text-text-light-1 h-16 z-40 w-full transition-colors duration-300 ease-in-out ${mode === 'dark' ? 'bg-dark-1 text-white' : 'bg-light-1'} ${params && params?.chatId ? 'hidden' : ''}`}>
        <div className='flex gap-6 items-center  justify-around w-full'>
          <div className={`hover:bg-b-light1 cursor-pointer rounded hover:bg-opacity-30 pt-1 px-1`}>
            {mode === "dark" ? <button onClick={() => toggleMode("light")}>
              <MdLightMode size={28} />
            </button> :
              <button onClick={() => toggleMode("dark")}>
                <MdDarkMode size={28} />
              </button>}
          </div>
          {sideBarItems.map((item) => (
            <Link
              className={`hover:bg-b-light1 cursor-pointer rounded hover:bg-opacity-30 p-1 ${item.active ? 'bg-opacity-30 bg-b-light1' : ''}`}
              href={`${item.path}`}
              title={item.name}
              key={item.name}
            >
              {item.logo}
            </Link>
          ))}
          <div className={`hover:bg-b-light1 cursor-pointer rounded hover:bg-opacity-30 p-1 ${myProfileBar ? ' bg-gray-300 bg-opacity-20' : ''}`} onClick={() => dispatch(setMyProfileBar(true))}>
            {user && user?.image ? <Image height={36} width={36} src={user.image} alt="" className='rounded-full p-1 hover:bg-opacity-40' /> :
              user?.name && <Avatar name={user.name} size='36' round style={{ fontSize: '12px' }} />}
          </div>

        </div>
      </div>
    </>
  )
}

export default BottomBarMobile
