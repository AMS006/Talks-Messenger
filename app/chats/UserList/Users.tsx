'use client'
import React, { useEffect, useState } from 'react'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import { find } from 'lodash'
import { toast } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

import GroupCreateModal from '@/components/Modals/GroupCreateModal'
import { User } from '@prisma/client'
import UserBox from './UserBox'
import logo from '@/public/logo.png'
import { useAppSelector } from '@/redux/hooks'
import { ConversationType } from '@/types'
import { pusherClient } from '@/libs/pusher'
import Link from 'next/link'

interface InputProps {
  conversations: ConversationType[]
  user: User
}
const Users: React.FC<InputProps> = ({ conversations, user }) => {

  const { mode } = useAppSelector((state) => state.user)

  const [groupModalOpen, setGroupModalOpen] = useState(false)
  const [currConversations, setCurrConversations] = useState<ConversationType[]>(conversations)
  const [allUsers, setAllUsers] = useState<User[]>()
  const [sortedConversations, setSortedConversations] = useState<ConversationType[]>([])

  const params = useParams()
  const router = useRouter()

  // Default values for group chat modal
  const defaultValues = {
    name: "",
    members: []
  }

  // For Handling Pusher Requests
  useEffect(() => {

    // Handle Realtime add new conversation
    function handleNewConversation(conversation: ConversationType) {
      if (conversation) {
        setCurrConversations((current) => {
          if (find(current, { id: conversation.id }))
            return current
          return [conversation, ...current]
        })
        router.push(`/chats/${conversation.id}`)
      }
    }
    // Handle Realtime delete conversation
    function handleDeleteConversation(conversation: ConversationType) {
      if (conversation) {
        let otherConversations = currConversations.filter((c) => c.id !== conversation.id)
        setCurrConversations(otherConversations)
        router.push('/chats')
        toast.success("Conversation Deleted")
      }
    }
    // Handle Realtime update in conversation List
    function handleUpdateConversation(conversation: ConversationType) {
      if (conversation) {
        setCurrConversations((current) => current.map((conver) => {
          if (conver.id === conversation.id) {
            return { ...conver, lastMessageAt: conversation.lastMessageAt, messages: conversation.messages }
          }
          return conver
        }))
      }
    }
    // Handle Realtime update in group conversation
    function handleGroupConversationUpdate(conversation: ConversationType) {
      if (conversation) {
        let conversationFound = false
        setCurrConversations((current) => current.map((conver) => {
          if (conver.id === conversation.id) {
            conversationFound = true
            return conversation
          }
          return conver
        }))
        if (!conversationFound)
          setCurrConversations((current) => [conversation, ...current])
      }
    }

    // Handles group conversation leave
    async function handleGroupLeaveConversation(conversation: ConversationType) {
      const updatedConversation = currConversations.filter((c) => conversation.id !== c.id)
      setCurrConversations(updatedConversation)
      router.push('/chats')
      toast.success("Conversation Deleted")
    }
    if (user) {
      // It subscribe to the conversation channel with key of user email
      pusherClient.subscribe(user.email)

      pusherClient.bind('conversation:new', handleNewConversation)
      pusherClient.bind('conversation:delete', handleDeleteConversation)
      pusherClient.bind('conversation:update', handleUpdateConversation)
      pusherClient.bind('conversation:group:update', handleGroupConversationUpdate)
      pusherClient.bind('conversation:group:leave', handleGroupLeaveConversation)

      return () => {
        pusherClient.unsubscribe(user.email)
        pusherClient.unbind('conversation:new')
        pusherClient.unbind('conversation:delete')
        pusherClient.unbind('conversation:update')
        pusherClient.unbind('conversation:group:update')
        pusherClient.unbind('conversation:group:leave')
      }
    }
  }, [user])

  // Getting the sorted list of conversation according to lastMessage
  useEffect(() => {
    if (currConversations.length > 0) {
      let updatedSortedConverstion = [...currConversations]
      updatedSortedConverstion.sort((a: ConversationType, b: ConversationType) => {
        let time1 = new Date(a.lastMessageAt).getTime()
        let time2 = new Date(b.lastMessageAt).getTime()

        return time2 - time1
      })
      setSortedConversations(updatedSortedConverstion)

      let allFinalUsers: User[] = []
      currConversations.map((conversation) => {
        if (!conversation.isGroup && user) {
          const userData = conversation.users.filter((u: any) => u.id !== user?.id);
          allFinalUsers.push(userData[0]);
        }
      })
      setAllUsers(allFinalUsers)
    }
  }, [currConversations])

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted)
    return null

  return (
    <>
      {conversations && allUsers && allUsers.length > 0 && <GroupCreateModal isOpen={groupModalOpen} onClose={() => setGroupModalOpen(false)} allUsers={allUsers} defaultValues={defaultValues} isUpdate={false} />}
      <aside className={`md:fixed md:w-80 md:left-16  md:border-r pb-16 md:block h-full ${mode === 'dark' ? '' : 'border-b-light1'} ${params && params?.chatId ? 'hidden' : 'block'}`}>
        <div className={`flex justify-between items-center md:px-4 px-2 h-16 sticky top-0 z-10 shadow transition-colors duration-300 ease-in-out ${mode === 'dark' ? 'bg-dark-1 text-white' : 'bg-light-1'}`}>
          <div className='flex items-center gap-1'>
            <Image src={logo} height={32} width={32} alt='logo' className='md:hidden rounded' />
            <h3 className='font-semibold text-xl'>Chats</h3>
          </div>
          <span className='hover:bg-b-light1 hover:bg-opacity-30 p-1 cursor-pointer rounded-full' onClick={() => setGroupModalOpen(true)}>
            <AiOutlineUsergroupAdd size={28} />
          </span>
        </div>
        <div className={`flex flex-col overflow-auto scrollbar transition-colors duration-300 ease-in-out h-full md:pb-0 pb-16 ${mode === 'dark' ? 'bg-dark-2' : 'bg-light-2'}`}>
          {sortedConversations.length > 0 ? sortedConversations.map((conversation, index) => (
            <UserBox conversation={conversation} user={user} key={index} />
          )) :
            <div className={`flex flex-col justify-center items-center gap-2.5 py-6 ${mode === 'dark'?'text-white':'text-black'}`}>
              <p>No Conversations Found</p>
              <p><Link href='/users' className='hover:underline text-blue-500'>Click Here</Link> to start new conversation</p>
            </div>}
        </div>
      </aside>
    </>
  )
}

export default Users