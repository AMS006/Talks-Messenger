'use client'
import axios from 'axios'
import { pusherClient } from '@/app/libs/pusher'
import MessageBox from './MessageBox'
import { useAppSelector } from '@/app/redux/hooks'
import { useEffect, useRef, useState } from 'react'
import { MessageType } from '@/app/types'
import { useParams } from 'next/navigation'
import Loader from '@/app/components/Loader'

const Body = () => {

  const [messages, setMessages] = useState<MessageType[]>([])
  const [loading, setLoading] = useState<Boolean>(false);
  const { mode} = useAppSelector((state) => state.user)

  const bottomRef = useRef<HTMLDivElement>(null);
  const params = useParams()
  const { currConversation } = useAppSelector((state) => state.conversation)

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      if(params && params.chatId){
        await axios.get(`/api/message/${params.chatId}`).then((data) => {
          setMessages(data.data.messages)
        }).finally(() => setLoading(false))
      }
    }
    if (params && params.chatId)
      fetchMessages()
  }, [])
  useEffect(() => {
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: MessageType) => {
      setMessages((current) => {
        return [...current, message]
      });
      bottomRef?.current?.scrollIntoView()
    }
    if (currConversation) {
      pusherClient.subscribe(currConversation.id)

      pusherClient.bind('message:new', messageHandler)
      pusherClient.bind('message:delete', () => setMessages([]))

      return () => {
        pusherClient.unsubscribe(currConversation.id)
        pusherClient.unbind('message:new')
      }
    }
  }, [currConversation])

  if(loading){
    return(
      <div className={`h-full w-full flex justify-center items-center ${mode && mode === 'light'?'bg-light-1':'bg-dark-1'}`}>
          <Loader height='36px' width='36px' />
      </div>
    )
  }
  return (
    <div className={`flex-1 overflow-y-auto py-2 px-2 scrollbar ${mode && mode === 'light'?'bg-light-1':'bg-dark-1'}`}>
      {
        messages.map((message,index) =>(
          <MessageBox message={message} key={index} />
        ))
      }
      <div className='pt-24' ref={bottomRef}/>
    </div>
  )
}

export default Body