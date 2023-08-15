'use client'
import React, { useEffect, useState } from 'react'
import Avatar from 'react-avatar'
import Image from 'next/image'
import Link from 'next/link'
import { BiArrowBack } from 'react-icons/bi'
import { TiGroup } from 'react-icons/ti'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setProfileBar } from '@/redux/user/slice'
import ProfileSideBar from '@/components/Sidebar/ProfileSideBar'
import { Conversation, User } from '@prisma/client'
import { ConversationType } from '@/types'

interface InputProps {
    conversation: Conversation & {
        users: User[]
    } | null
    user: User
    conversations: ConversationType[]
}
const Header: React.FC<InputProps> = ({ conversation, user, conversations }) => {

    const { mode, activeUsers } = useAppSelector((state) => state.user)
    const [isActive, setIsActive] = useState<boolean>(false)
    const [otherUser, setOtherUser] = useState<User>()
    const [userList, setUserList] = useState<string>('')


    const dispatch = useAppDispatch()

    useEffect(() => {
        setIsActive(false)
        if (activeUsers && activeUsers.length > 0 && otherUser) {
            let active = activeUsers.find((email) => email === otherUser?.email)
            if (active)
                setIsActive(true)
        }
    }, [activeUsers, otherUser])

    useEffect(() => {
        if (conversation && user && conversation.users) {
            let userData = conversation.users.filter((u: any) => u.id !== user?.id)
            setOtherUser(userData[0])
            let allUsers = conversation.users
            const userListData = allUsers.filter((u) => u.id !== user.id)
            if (userListData) {
                let userNames = userListData.map((u) => u.name)
                setUserList('You, ' + userNames.join(', '))
            }

        }

    }, [conversation, user])

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted)
        return null

    return (
        <>
            {otherUser && <ProfileSideBar conversation={conversation} user={user} conversations={conversations} />}
            {otherUser && <div className={`flex items-center select-none transition-colors duration-300 ease-in-out w-full shadow-lg  md:p-4 h-16  px-2 ${mode === 'dark' ? 'bg-dark-2 text-white' : 'bg-light-2 text-black'}`}>
                <div className='flex gap-2 items-center w-full'>
                    <div className='flex md:gap-3 gap-1 items-center w-full md:py-0 py-3'>
                        <div className='cursor-pointer'>
                            <Link href={'/chats'} className='md:hidden block rounded-full hover:bg-gray-300 hover:bg-opacity-20 p-1'>
                                <BiArrowBack size={24} />
                            </Link>
                        </div>
                        <div className='sm:w-11/12 w-4/5 flex items-center gap-2 cursor-pointer' onClick={() => dispatch(setProfileBar(true))}>
                            {otherUser.image && !conversation?.isGroup ? <Image src={otherUser.image} height={32} width={32} className='rounded-full h-[38px] w-[38px]' alt="userIcon" /> :
                                otherUser.name && !conversation?.isGroup && <Avatar name={otherUser.name} size='38' round style={{ fontSize: '15px' }} />}
                            {conversation && conversation.isGroup &&
                                <div className={`flex items-center justify-center h-[38px] w-[38px] rounded-full transition-colors duration-300 ease-in-out bg-opacity-50 p-1.5 ${mode === 'dark' ? 'bg-light-1 text-white' : 'text-text-light-1 bg-b-light1'}`}>
                                    <TiGroup size={28} />
                                </div>}
                            {conversation && !conversation.isGroup && <div className='flex flex-col '><h2 className='font-semibold select-none'>{otherUser?.name}</h2> {isActive ? <span className='text-xs '>Active</span> : <span className='text-xs '>Not Active</span>} </div>}
                            {conversation && conversation.isGroup && <div className='flex flex-col gap-0.5 w-11/12'>
                                <h2 className='font-semibold select-none'>{conversation.name}</h2>
                                <p className='text-sm truncate w-11/12'>{userList}</p>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Header