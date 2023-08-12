import React, { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { IoAdd } from 'react-icons/io5'
import { toast } from 'react-hot-toast'
import { User } from '@prisma/client'
import Avatar from 'react-avatar'

import { useAppDispatch } from '@/redux/hooks'
import { addConversations } from '@/redux/conversation/slice'
import Loader from '@/components/Loader'

const SearchUserBox = ({ user }: { user: User | undefined }) => {

    const [loading, setLoading] = useState(false);

    const dispatch = useAppDispatch()

    const handleAddConversation = async () => {
        if (user && user.id) {
            setLoading(true)
            await axios.post('/api/conversation', { id: user.id }).then((conversation) => {
                dispatch(addConversations(conversation.data.conversation))
                toast.success("Conversation Added")
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
                <div className='flex gap-4 items-center w-full justify-between'>
                    <h2 className='select-none'>{user.name}</h2>
                    {!loading ? <button onClick={handleAddConversation} className='hover:bg-b-light1 hover:bg-opacity-30 p-1'>
                        <IoAdd size={28} />
                    </button> : <Loader height='24px' width='24px' />}
                </div>
            </div>}
        </>
    )
}

export default SearchUserBox