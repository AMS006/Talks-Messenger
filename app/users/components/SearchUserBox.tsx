import React, { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { IoAdd } from 'react-icons/io5'
import { toast } from 'react-hot-toast'
import { User } from '@prisma/client'
import Avatar from 'react-avatar'

import Loader from '@/components/Loader'
import { useRouter } from 'next/navigation'

interface InputProps{
    user: User
    loadingConversation: string
    setLoadingConversation: React.Dispatch<React.SetStateAction<string>>
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchUserBox: React.FC<InputProps> = ({user,loadingConversation,setLoadingConversation,loading,setLoading}) => {

    const router = useRouter()
    const handleAddConversation = async () => {
        if (!loading && user && user.id) {
            setLoading(true)
            setLoadingConversation(user.id)
            await axios.post('/api/conversation', { id: user.id }).then((conversation) => {
                toast.success("Conversation Added")
                router.refresh()
                router.push(`/chats/${conversation.data.conversation.id}`)
                setLoadingConversation('')
            }).finally(() => setLoading(false))
        }
    }
    return (
        <>
            {user && <div className='flex gap-1 select-none border border-b-light1 items-center  rounded px-2 py-2'>
                <div>
                    {user && user.image ? <Image height={36} width={36} src={user.image} alt="" className='rounded-full p-1 hover:bg-opacity-40' /> :
                        user.name && <Avatar name={user.name} size='36' round style={{ fontSize: '12px' }} />}
                </div>
                <div className={`flex gap-4 items-center w-full justify-between ${loading?'opacity-50':''}`}>
                    <h2 className='select-none'>{user.name}</h2>
                    {loadingConversation !== user.id ? <button onClick={handleAddConversation} disabled={loading} className={` hover:bg-opacity-30 p-1 ${!loading?'hover:bg-b-light1':''}`}>
                        <IoAdd size={28} />
                    </button> : <Loader height='24px' width='24px' />}
                </div>
            </div>}
        </>
    )
}

export default SearchUserBox