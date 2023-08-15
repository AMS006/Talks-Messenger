'use client'
import { useEffect, useRef, useState } from 'react'

import MessageBox from './MessageBox'
import { pusherClient } from '@/libs/pusher'
import { useAppSelector } from '@/redux/hooks'
import { MessageType } from '@/types'
import { Conversation, User } from '@prisma/client'

interface InputProps {
  initialMessages: MessageType[]
  chatId: string
  user: User
  conversation: Conversation & {
    users: User[]
  } | null
}

const Body: React.FC<InputProps> = ({ initialMessages, chatId, user, conversation }) => {

  const [messages, setMessages] = useState<MessageType[]>(initialMessages)
  const { mode } = useAppSelector((state) => state.user)

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: MessageType) => {
      setMessages((current) => {
        return [...current, message]
      });
      bottomRef?.current?.scrollIntoView()
    }
    if (chatId) {
      pusherClient.subscribe(chatId)

      pusherClient.bind('message:new', messageHandler)
      pusherClient.bind('message:delete', () => setMessages([]))

      return () => {
        pusherClient.unsubscribe(chatId)
        pusherClient.unbind('message:new')
      }
    }
  }, [chatId])

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted)
    return null

  return (
    <div className={`flex-1 overflow-y-auto py-2 px-2 scrollbar ${mode === 'dark' ? 'bg-dark-1' : 'bg-light-1'}`}>
      {
        messages.map((message, index) => (
          <MessageBox message={message} user={user} conversation={conversation} key={index} />
        ))
      }
      <div className='pt-24' ref={bottomRef} />
    </div>
  )
}

export default Body