'use client'
import React, { useState } from 'react'
import { BsImageFill } from 'react-icons/bs'
import { BiSend } from 'react-icons/bi'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { CldUploadButton } from 'next-cloudinary'
import { useAppSelector } from '@/app/redux/hooks'
const InputBox = () => {
    const [text, setText] = useState('')
    const { mode } = useAppSelector((state) => state.user)
    const params = useParams()
    const handleSubmit = async () => {
        const data = {
            text,
            image: '',
            conversationId: params.chatId!
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
            conversationId: params.chatId!
        }

        await axios.post('/api/message', data)
    }
    return (
        <div className={`flex gap-2 items-center transition-colors duration-300 ease-in-out md:p-4 px-2 py-4 ${mode && mode === 'light' ? 'bg-light-2' : 'bg-dark-2'}`}>
            <div>
                <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset="foafbmjm"
                >
                    <BsImageFill size={28} className={`transition-colors duration-300 ease-in-out ${mode && mode === 'light' ? 'text-text-light-1' : 'text-white'}`} />
                </CldUploadButton>

            </div>
            <div className={` transition-colors duration-300 ease-in-out relative w-full ${mode && mode === 'light' ? 'bg-light-1' : 'bg-dark-1'}`}>
                <input
                    type="text"
                    name="text"
                    id="text"
                    value={text}
                    onKeyDown={(e) => handleKeyDown(e.key)}
                    placeholder='Type a message'
                    onChange={(e) => setText(e.target.value)}
                    className={`w-full bg-transparent p-2 rounded focus:outline-none ${mode && mode === 'light' ? 'text-black' : 'text-white'}`}
                />
            </div>
            <div>
                <button onClick={handleSubmit}>
                    <BiSend size={30} className={`transition-colors duration-300 ease-in-out ${mode && mode === 'light' ? 'text-text-light-1' : 'text-white'}`} />
                </button>
            </div>
        </div>
    )
}

export default InputBox