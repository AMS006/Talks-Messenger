'use client'
import React, { useEffect, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import Image from 'next/image'
import Link from 'next/link'
import ProfileSideBar from '@/app/components/Sidebar/ProfileSideBar'
import { User } from '@prisma/client'
import Avatar from 'react-avatar'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { setCurrConversation } from '@/app/redux/conversation/slice'
import { TiGroup } from 'react-icons/ti'
import { setProfileBar } from '@/app/redux/user/slice'

const Header = () => {

    const { conversations, currConversation } = useAppSelector((state) => state.conversation)
    const { user, mode } = useAppSelector((state) => state.user)

    const dispatch = useAppDispatch()

    const [otherUser, setOtherUser] = useState<User>()
    const param = useParams()

    useEffect(() => {
        if (param && param.chatId && conversations) {
            conversations.map((conversation) => {
                if (conversation.id === param.chatId)
                    dispatch(setCurrConversation(conversation))
            })
        }
    }, [param])
    useEffect(() => {
        if (currConversation && user && currConversation.users) {
            let userData = currConversation.users.filter((u) => u.id !== user?.id)
            setOtherUser(userData[0])
        }
    }, [currConversation])
    return (
        <>
            {otherUser && <ProfileSideBar name={otherUser?.name} email={otherUser?.email} image={otherUser?.image} />}
            {otherUser && <div className={`flex items-center transition-colors duration-300 ease-in-out w-full shadow-lg  md:p-4 h-16  px-2 ${mode && mode === 'light' ? 'bg-light-2 text-black' : 'bg-dark-2 text-white'}`}>
                <div className='flex gap-2 items-center w-full'>
                    <div className='flex md:gap-3 gap-1 items-center w-full md:py-0 py-3'>
                        <div className='cursor-pointer'>
                            <Link href={'/chats'} className='md:hidden block rounded-full hover:bg-gray-300 hover:bg-opacity-20 p-1'>
                                <BiArrowBack size={24} />
                            </Link>
                        </div>
                        <div className='w-full flex items-center gap-2 cursor-pointer' onClick={() => dispatch(setProfileBar(true))}>
                            {otherUser.image && !currConversation?.isGroup ? <Image src={otherUser.image} height={32} width={32} className='rounded-full h-[38px] w-[38px]' alt="userIcon" /> :
                                otherUser.name && !currConversation?.isGroup && <Avatar name={otherUser.name} size='38' round style={{ fontSize: '15px' }} />}
                            {currConversation && currConversation.isGroup &&
                                <div className={`flex items-center justify-center h-[38px] w-[38px] rounded-full transition-colors duration-300 ease-in-out bg-opacity-50 p-1.5 ${mode && mode === 'light' ? 'text-text-light-1 bg-b-light1' : 'bg-light-1 text-white'}`}>
                                    <TiGroup size={28} />
                                </div>}
                            {currConversation && !currConversation.isGroup && <h2 className='font-semibold'>{otherUser?.name}</h2>}
                            {currConversation && currConversation.isGroup && <h2 className='font-semibold'>{currConversation.name}</h2>}

                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Header