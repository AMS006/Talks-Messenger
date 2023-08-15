import React, { useEffect, useState } from 'react'
import { BsArrowRight } from 'react-icons/bs'
import Image from 'next/image'
import Avatar from 'react-avatar'
import { MdDelete } from 'react-icons/md'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { MdOutlinePersonAddAlt1 } from 'react-icons/md'
import { BiExit } from 'react-icons/bi'
import { useRouter } from 'next/navigation'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setProfileBar } from '@/redux/user/slice'
import { Conversation, User } from '@prisma/client'
import GroupUserBox from './GroupUserBox'
import GroupCreateModal from '../Modals/GroupCreateModal'
import AlertModal from '../Modals/AlertModal'
import { ConversationType } from '@/types'
import { pusherClient } from '@/libs/pusher'

interface data {
    conversation: Conversation & {
        users: User[]
    } | null
    user: User
    conversations: ConversationType[]
}
const ProfileSideBar: React.FC<data> = ({ conversation, user, conversations }) => {

    const { profileBar, mode } = useAppSelector((state) => state.user)
    const dispatch = useAppDispatch();

    const [currConversation, setCurrConversation] = useState(conversation)
    const [groupUpdateModalOpen, setGroupUpdateModalOpen] = useState(false)
    const [otherUsers, setOtherUsers] = useState<{ value: string, label: string }[]>();
    const [allUsers, setAllUsers] = useState<User[]>()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isConfirm, setIsConfirm] = useState(false)
    const [deleteData, setDeleteData] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [otherUser, setOtherUser] = useState<User>()

    const router = useRouter()

    const handleChatDelete = async () => {
        setDeleteData("chats")
        setTitle("Delete Chats")
        setDescription("Are you sure you want to delete all Chats")
        setIsOpen(true)

    }
    const deleteChat = async () => {
        if (conversation && conversation.id) {
            await axios.delete(`/api/message/${conversation.id}`).then(() => {
                toast.success("Chats Deleted")
            }).catch(() => toast.error("Chats Delete Failed"))
        }
    }
    const handleConversationDelete = async () => {
        setDeleteData("conversation")
        setTitle("Delete Conversation")
        setDescription("Are you sure you want to delete this conversation")
        setIsOpen(true)
    }
    const deleteConversation = async () => {
        if (conversation && conversation.id) {
            await axios.delete(`/api/conversation/${conversation.id}`).then(() => {

            }).catch(() => toast.error("Conversation Delete Failed"))
        }
    }
    const handleLeaveGroup = async () => {
        setDeleteData("group")
        setTitle("Group Leave")
        setDescription("Are you sure you want to left this group")
        setIsOpen(true)
    }
    const leaveGroup = async () => {
        if (conversation) {
            dispatch(setProfileBar(false))
            await axios.put('/api/conversation', { leaveGroup: true, members: otherUsers, conversationId: conversation.id }).then(async () => {
                router.push('/chats')
                await axios.post('/api/message', { text: `left the group`, messageType: "user", conversationId: conversation.id })
            })
        }
    }
    useEffect(() => {
        if (isConfirm) {
            if (deleteData === 'chats') {
                deleteChat()
            } else if (deleteData === 'conversation') {
                deleteConversation()
            } else if (deleteData === 'group') {
                leaveGroup()
            }
            setIsConfirm(false)
            setDeleteData("")
        }
    }, [isConfirm])
    const getAllUsers = () => {
        let allFinalUsers: User[] = []
        let userSet = new Set();
        if (conversation?.isGroup) {
            conversation.userIds.map((id) => userSet.add(id))
        }
        conversations.map((conversation) => {
            if (!conversation.isGroup && user) {
                const userData = conversation.users.filter((u: any) => {
                    if (!userSet.has(u.id))
                        return u;
                })
                if (userData && userData.length > 0)
                    allFinalUsers.push(userData[0]);
            }
        })
        setAllUsers(allFinalUsers)
    }
    useEffect(() => {
        let memberData: { value: string, label: string }[] = []
        if (conversation) {
            conversation.users.map((data) => {
                if (data.id !== user?.id && data.id && data.name)
                    memberData.push({ value: data.id, label: data.name })
            })
            if (!conversation.isGroup) {
                conversation.users.map((u) => {
                    if (u.id !== user.id)
                        setOtherUser(u)
                })
            }

        }
        setOtherUsers(memberData)
        if (conversations)
            getAllUsers()
    }, [conversation, conversations, user?.id])


    useEffect(() => {
        function handleGroupConversationUpdate(conversation: ConversationType) {
            if (conversation) {
                console.log(conversation)
                setCurrConversation(conversation)
            }
        }
        pusherClient.bind('conversation:group:update', handleGroupConversationUpdate)
        return () => {
            pusherClient.unbind('conversation:group:update')
        }
    }, [user])
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted)
        return null
    return (
        <>
            <AlertModal isOpen={isOpen} setIsOpen={setIsOpen} setIsConfirm={setIsConfirm} title={title} description={description} />
            <div className={`absolute right-0 z-10 h-full md:w-80 w-full md:opacity-90 transition-all ease-in-out duration-300 ${mode === "dark" ? 'bg-dark-2 text-white' : 'bg-light-2'} ${profileBar ? 'translate-x-0' : 'translate-x-full'}`}>
                {conversation && !conversation.isGroup && <>
                    <div className={`flex items-center justify-between gap-4 px-4 h-16 transition-colors duration-300 ease-in-out ${mode === 'dark' ? 'bg-dark-1' : 'bg-light-1'}`}>
                        <h2 className='font-semibold text-lg'>Profile</h2>
                        <button className='hover:bg-b-light1 hover:bg-opacity-30 p-2 rounded-full' onClick={() => dispatch(setProfileBar(false))} >
                            <BsArrowRight size={24} />
                        </button>
                    </div>
                    <div className='py-8 flex flex-col gap-4 w-full '>
                        <div className='w-full flex justify-center'>
                            {otherUser?.image ? <Image src={otherUser.image} alt='profile' height={80} width={80} className='rounded-full' /> :
                                otherUser?.name && <Avatar name={otherUser?.name} size='80' round />}
                        </div>
                        <div className='flex flex-col gap-10 px-4'>
                            <div className='flex flex-col gap-3'>
                                <label htmlFor="name" className='text-[#6d94c6] text-sm font-semibold'>Name</label>
                                <h6 className='font-semibold py-2 border-b border-black'>{otherUser?.name}</h6>
                            </div>
                            <div className='flex flex-col gap-3'>
                                <label htmlFor="email" className='text-[#6d94c6] text-sm font-semibold'>Email</label>
                                <h6 className='font-semibold py-2 border-b border-black'>{otherUser?.email}</h6>
                            </div>
                            <div className='flex justify-center items-center gap-2'>
                                <button className='flex items-center gap-1 bg-danger text-white px-2 py-1 rounded' title='Delete All Chats' onClick={handleChatDelete}>
                                    <MdDelete size={16} />
                                    <span>All Chats</span>
                                </button>
                                <button className='flex items-center gap-1 bg-danger text-white px-2 py-1 rounded' title='Delete Conversation' onClick={handleConversationDelete}>
                                    <MdDelete size={16} />
                                    <span>Conversation</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>}
                {conversation && conversation.isGroup &&
                    <>
                        {conversation && conversation.name && otherUsers && allUsers && <GroupCreateModal isOpen={groupUpdateModalOpen} conversation={conversation} onClose={() => setGroupUpdateModalOpen(false)} defaultValues={{ name: conversation.name }} allUsers={allUsers} isUpdate={true} />}
                        <div className={`flex items-center justify-between gap-4 px-4 h-16 transition-colors duration-300 ease-in-out ${mode === 'dark' ? 'bg-dark-1' : 'bg-light-1'}`}>
                            <h2 className='font-semibold text-lg'>{conversation.name}</h2>
                            <button className='hover:bg-b-light1 hover:bg-opacity-30 p-2 rounded-full' onClick={() => dispatch(setProfileBar(false))} >
                                <BsArrowRight size={24} />
                            </button>
                        </div>
                        <div className='flex justify-between gap-2 items-center p-2'>
                            <h2 className='text-lg px-2 pt-4 font-semibold'>Group Members</h2>
                            <button className='flex justify-center items-center gap-2 px-2 py-1 rounded  bg-b-light1 text-white hover:bg-opacity-60' title='Add Users' onClick={() => setGroupUpdateModalOpen(true)}>
                                <MdOutlinePersonAddAlt1 size={20} />
                                <span>Users</span>
                            </button>
                        </div>
                        <div className='px-4 py-2'>
                            <p>Total Members: {conversation?.users?.length}</p>
                        </div>
                        <div className='flex flex-col gap-4 px-3 py-2 overflow-y-auto scrollbar h-3/5'>
                            {user && <div className='border-b flex gap-3 py-2 items-center'>
                                {user.image ? <Image src={user?.image} height={32} width={32} className='rounded-full h-[38px] w-[38px]' alt={'user'} /> :
                                    user.name && <Avatar name={user.name} size='32' round style={{ fontSize: '14px' }} />}
                                <h3 className='font-medium'>Me</h3>
                            </div>}
                            {user && currConversation?.users.map((data, index) => {
                                if (data.id !== user.id)
                                    return <GroupUserBox user={data} key={index} />
                            }
                            )}
                        </div>
                        <div className='flex justify-center my-6'>
                            <button className='flex items-center gap-1 px-2 py-1 rounded bg-danger text-white' onClick={handleLeaveGroup}>
                                Exit Group
                                <BiExit />
                            </button>
                        </div>
                    </>}
            </div>
        </>
    )
}
export default ProfileSideBar