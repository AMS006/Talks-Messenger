'use client'
import { signOut, } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { BsChatText } from 'react-icons/bs'
import { FaUserFriends } from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'
import { MdDarkMode, MdLightMode } from 'react-icons/md'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import logo from '../../../public/logo.png'
import MyProfileBar from './MyProfileBar'
import Avatar from 'react-avatar'
import { User } from '@prisma/client'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { setCurrUser, setMyProfileBar, setUserMode } from '@/app/redux/user/slice'

const DesktopSidebar = ({currUser }: { currUser: User }) => {
    const path = usePathname()
    const dispatch = useAppDispatch()

    const { user, myProfileBar, mode } = useAppSelector((state) => state.user)
    const toggleMode = (val: string) => {
        dispatch(setUserMode(val))
        localStorage.setItem("mode", val)
    }
    useEffect(() => {
        if (currUser) {
            dispatch(setCurrUser(currUser))
        }

    }, [currUser,dispatch])

    useEffect(() => {
        if (!localStorage.mode) {
            localStorage.setItem("mode", "light")
            dispatch(setUserMode("light"))
        } else {
            dispatch(setUserMode(localStorage.getItem("mode") || ""))
        }
    }, [dispatch])

    const sideBarItems = [
        {
            name: "Chats",
            path: '/chats',
            logo: <BsChatText size={26} />,
            active: path === '/chats'
        },
        {
            name: "Users",
            path: '/users',
            logo: <FaUserFriends size={26} />,
            active: path === '/users'
        },
    ]
    return (
        <>
            {currUser && <div className='hidden md:block'>
                <MyProfileBar />
            </div>}
            <div className={`hidden md:w-16 md:flex fixed left-0 z-20 flex-col py-2 transition-colors duration-300 ease-in-out border-r  shadow-lg h-full ${mode && mode === 'light' ? 'bg-light-1 border-b-light1 text-text-light-1' : 'bg-dark-1 text-white'}`}>
                <div className='flex flex-col items-center'>
                    <Image src={logo} alt="logo" width={48} height={48} title='Talks Messanger' />
                    <h6 className='text-sm font-bold'>Talks</h6>
                </div>
                <div className='flex flex-col h-full justify-between py-4'>
                    <div className='flex flex-col  gap-6 items-center py-8 w-full'>
                        {sideBarItems.map((item) => (
                            <Link
                                className={`hover:bg-b-light1 cursor-pointer rounded hover:bg-opacity-30 p-1 ${item.active ? 'bg-opacity-40 bg-b-light1' : ''}`}
                                href={`${item.path}`}
                                title={item.name}
                                key={item.name}
                            >
                                {item.logo}
                            </Link>
                        ))}
                    </div>
                    <div className='flex flex-col justify-center items-center gap-3'>
                        <div className={`hover:bg-b-light1 cursor-pointer rounded hover:bg-opacity-30 pt-1 px-1`}>
                            {mode === "light" ? <button onClick={() => toggleMode("dark")}>
                                <MdDarkMode size={28} />
                            </button> :
                                <button onClick={() => toggleMode("light")}>
                                    <MdLightMode size={28} />
                                </button>}
                        </div>
                        <div className={`hover:bg-b-light1 cursor-pointer rounded hover:bg-opacity-30 p-1 ${myProfileBar ? ' bg-b-light1 bg-opacity-40' : ''}`} onClick={() => dispatch(setMyProfileBar(true))}>
                            {user && user?.image ? <Image height={36} width={36} src={user.image} alt="" className='rounded-full p-1 hover:bg-opacity-40' /> :
                                user?.name && <Avatar name={user.name} size='36' round style={{ fontSize: '12px' }} />}
                        </div>
                        <div className='hover:bg-b-light1 rounded cursor-pointer hover:bg-opacity-30 p-1' onClick={() => signOut()}>
                            <BiLogOut size={26} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DesktopSidebar