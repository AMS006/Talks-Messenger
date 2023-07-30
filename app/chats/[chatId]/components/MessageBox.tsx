'use client'
import { MessageType } from '@/app/types'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import { useAppSelector } from '@/app/redux/hooks'
import ModalImage from "react-modal-image";
import getImageUrl from '@/app/libs/getImageUrl'
dayjs.extend(calendar)


const MessageBox = ({ message }: { message: MessageType }) => {
  const { user } = useAppSelector((state) => state.user)
  const [time, setTime] = useState<string>()
  const [smallImage, setSmallImage] = useState('')
  const [largeImage, setLargeImage] = useState('')

  useEffect(() => {
    if (message.createdAt) {
      let data = dayjs(message.createdAt).calendar(null, {
        sameDay: '[Today at] h:mm A',
        lastDay: '[Yesterday]',
        lastWeek: 'dddd',
        sameElse: 'DD/MM/YYYY'
      })
      setTime(data)
    }
  }, [message])

  useEffect(() => {
    setSmallImage('')
    setLargeImage('')
    if (message.image) {
      const smallData = {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
        publicId: message.image,
        transformations: 'c_thumb,w_200,g_face'
      }
      const largeData = {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
        publicId: message.image,
        transformations: ''
      }
      setSmallImage(getImageUrl(smallData))
      setLargeImage(getImageUrl(largeData))
    }
  }, [message, message.image])

  const { currConversation } = useAppSelector((state) => state.conversation)
  const { mode } = useAppSelector((state) => state.user)
  return (
    <>
      {message && message.messageType === 'text' && <div className={`flex my-2 ${message.senderId === user?.id ? 'justify-end' : 'justify-start'} `}>
        {user &&
          <div className={`transition-colors duration-300 ease-in-out ${message.senderId === user?.id ? 'bg-[#6d94c6]' : `${mode && mode === 'light' ? 'bg-light-2' : 'bg-dark-2 text-white'}`} text-black relative px-1.5 py-1.5 rounded  max-w-[85%]`}>
            {currConversation?.isGroup && <h5 className='-mt-0.5 underline -ml-0.5 text-sm font-medium truncate'>{message.sender.id === user.id ? 'Me' : message.sender.name}</h5>}
            {message.text && message.text.length > 0 && <p className='text-clip py-0.5 text-[15px]'>{message.text}</p>}
            {smallImage && largeImage && <ModalImage small={smallImage} large={largeImage} />}
            {time && <div className={`pl-2 leading-none text-gray-600 relative -mr-0.5 float-right text-[11px] font-sans text-right ${message.image && message.image.length > 0 ? 'mt-1' : ''}`}>{time}</div>}
          </div>}
      </div>}
      {user && message && message.messageType === 'user' &&
        <div className='flex justify-center my-2'>
          <p className='text-xs
         bg-light-2 px-2 py-1 font-semibold rounded'>{message.senderId === user.id ? `You ${message.text}` : `${message.sender.name} ${message.text}`}</p>
        </div>
      }
    </>
  )
}

export default MessageBox