'use client'
import { pusherClient } from '@/app/libs/pusher'
import MessageBox from './MessageBox'
import { useAppSelector } from '@/app/redux/hooks'
import { useEffect, useState } from 'react'
import { MessageType } from '@/app/types'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Loader from '@/app/components/Loader'

const Body = () => {

  const [messages, setMessages] = useState<MessageType[]>([])
  const [loading, setLoading] = useState<Boolean>(false);
  const { mode,user } = useAppSelector((state) => state.user)

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
  useEffect(() =>{
    console.log(messages)
    if(messages && messages.length > 0 && params && user){
      let idx = messages[messages.length -1].seenUserIds.find((id) => id === user.id)
      console.log(idx)
      if(idx === undefined)
        axios.post(`/api/conversation/${params.chatId}/seen`)
    }
  },[messages])

  useEffect(() => {
    const messageHandler = (message: MessageType) => {
      setMessages((current) => {
        return [...current, message]
      });
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
  return (
    <div className={`h-full overflow-auto transition-colors duration-300 ease-in-out ${mode && mode === 'light' ? 'bg-light-1' : 'bg-dark-1'}`}>
      {!loading ? <div className='h-full flex gap-2 py-4 md:px-4 px-2 overflow-y-auto scrollbar flex-col'>
        {messages && messages.map((message) => (
          <MessageBox message={message} key={message.id} />
        ))}
      </div> :
        <div className='h-full w-full flex justify-center items-center'>
          <Loader height='36px' width='36px' />
        </div>
      }
    </div>
  )
}

export default Body