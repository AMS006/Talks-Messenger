'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { CldUploadButton } from 'next-cloudinary'
import { useParams } from 'next/navigation'
import { BsImageFill } from 'react-icons/bs'
import { BiSend } from 'react-icons/bi'

import { useAppSelector } from '@/redux/hooks'

const InputBox = () => {
    const [text, setText] = useState('')
    const { mode } = useAppSelector((state) => state.user)
    const params = useParams()
    const handleSubmit = async () => {
        const data = {
            text,
            image: '',
            conversationId: params && params.chatId || ""
        }
        setText('')
        await axios.post('/api/message', data)
    }
    const handleKeyDown = (key: string) => {
        if (key === 'Enter' && text.length > 0) {
            handleSubmit()
        }
    }
    const handleUpload = async (result: any) => {
        const data = {
            text: '',
            image: result.info.public_id,
            conversationId: params && params.chatId || ""
        }
        await axios.post('/api/message', data)
    }

    const [mount, setMount] = useState(false)

    useEffect(() => {
        setMount(true)
    }, [])
    if (!mount)
        return null
    return (
        <div className={`flex gap-2 items-center transition-colors duration-300 ease-in-out md:p-4 px-2 py-4 ${mode === 'dark' ? 'bg-dark-2' : 'bg-light-2'}`}>
            <CldUploadButton
                options={{ maxFiles: 1 }}
                onUpload={handleUpload}
                uploadPreset="foafbmjm"
            >
                <BsImageFill size={28} className={`transition-colors duration-300 ease-in-out ${mode === 'dark' ? 'text-white' : 'text-text-light-1'}`} />
            </CldUploadButton>
            <div className={`transition-colors duration-300 ease-in-out relative w-full ${mode === 'dark' ? 'bg-dark-1' : 'bg-light-1'}`}>
                <input
                    type="text"
                    name="text"
                    id="text"
                    value={text}
                    onKeyDown={(e) => handleKeyDown(e.key)}
                    placeholder='Type a message'
                    onChange={(e) => setText(e.target.value)}
                    className={`w-full bg-transparent p-2 rounded focus:outline-none ${mode === 'dark' ? 'text-white' : 'text-black'}`}
                />
            </div>
            <div>
                <button onClick={handleSubmit}>
                    <BiSend size={30} className={`transition-colors duration-300 ease-in-out ${mode === 'dark' ? 'text-white' : 'text-text-light-1'}`} />
                </button>
            </div>
        </div>
    )
}

export default InputBox