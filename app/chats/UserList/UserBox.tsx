'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { User } from '@prisma/client'
import { ConversationType} from '@/app/types'
import Avatar from 'react-avatar'
import { useParams, useRouter } from 'next/navigation'
import { TiGroup } from 'react-icons/ti'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import { useAppSelector } from '@/app/redux/hooks'
dayjs.extend(calendar)

const UserBox = ({ conversation }: { conversation: ConversationType }) => {

  const { user, mode, activeUsers } = useAppSelector((state) => state.user)
  const [otherUser, setOtherUser] = useState<User>()

  const [time, setTime] = useState<string>()
  const [lastMessage, setLastMessage] = useState<string | null>('')
  const [isActive,setIsActive] = useState<boolean>(false)

  useEffect(() =>{
    setIsActive(false)
    if(activeUsers && activeUsers.length>0 && otherUser){
      let active = activeUsers.find((email) => email === otherUser?.email)
      if(active)
        setIsActive(true)
    }
  },[activeUsers,otherUser])

  useEffect(() => {
    setLastMessage('')
    if (conversation.messages && conversation.messages.length > 0) {
      if (conversation.messages) {
        if (conversation.messages[0].image) {
          setLastMessage('Image')
        } else {
          setLastMessage(conversation.messages[0].text)
        }
      }
    }
    const userData = conversation.users.filter((u: any) => u.id !== user?.id)
    setOtherUser(userData[0])
  }, [conversation])
  useEffect(() => {
    if (lastMessage) {
      let data = dayjs(conversation.lastMessageAt).calendar(null, {
        sameDay: 'h:mm A',
        lastDay: '[Yesterday]',
        lastWeek: 'dddd',
        sameElse: 'DD/MM/YYYY'
      })
      setTime(data)
    }
  }, [lastMessage])

  const router = useRouter()
  const params = useParams()
  const handleClick = () => {
    router.push(`/chats/${conversation.id}`)
  }
  return (
    <div className={`relative flex gap-3 items-center border-b border-b-light1 py-3 px-2 hover:bg-b-light1 hover:bg-opacity-10 select-none cursor-pointer ${params && params.chatId && params.chatId === conversation.id ? 'md:bg-b-light1 md:bg-opacity-20' : ''}`} onClick={() => handleClick()}>
      {otherUser && !conversation.isGroup && <div className='relative'>
        {otherUser.image ? <Image src={otherUser?.image} height={38} width={38} className='rounded-full w-[38px] h-[38px]' alt={conversation.name || 'conversation'} /> :
          otherUser.name && <Avatar name={otherUser.name} size='38' round style={{ fontSize: '15px' }} />}
          {isActive && <span className='h-2 w-2 bg-green-600 rounded-full absolute top-1 right-0 z-20' title='Active'/>}
      </div>}
      {conversation.isGroup &&
        <div className={`flex items-center justify-center h-[38px] w-[38px] rounded-full transition-colors duration-300 ease-in-out  bg-opacity-40  p-1.5 ${mode && mode === 'light' ? 'text-text-light-1 bg-b-light1' : 'bg-light-1 text-white'}`}>
          <TiGroup size={28} />
        </div>}
      {otherUser && <div className='md:w-5/6 sm:w-11/12 w-5/6'>
        <div className='flex justify-between items-center gap-10 w-full'>
          {!conversation.isGroup ? <h5 className={`truncate transition-colors duration-300 ease-in-out ${mode && mode === 'light' ? 'text-black' : 'text-white'}`}>{otherUser.name}</h5> :
            <h5 className={`truncate transition-colors select-none duration-300 ease-in-out ${mode && mode === 'light' ? 'text-black' : 'text-white'}`}>{conversation.name}</h5>}
          {time && conversation.messages && conversation.messages.length > 0 && <div className='text-gray-400  text-xs font-sans flex items-center gap-2'>
            <span title='Time' className='select-none'>{time}</span>
          </div>}
        </div>
        {lastMessage ? <p className={`text-xs transition-colors duration-300 ease-in- select-none truncate max-w-[60%] ${mode && mode === 'light' ? 'text-black' : 'text-white'} `}>{lastMessage}</p> : <p className='text-xs text-gray-500'>Started Conversation</p>}
      </div>}

    </div>
  )
}

export default UserBox