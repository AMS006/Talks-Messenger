'use client'
import React, { useEffect, useState } from 'react'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import UserBox from './UserBox'
import { useParams, useRouter } from 'next/navigation'
import logo from '../../../public/logo.png'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import GroupCreateModal from '@/app/components/Modals/GroupCreateModal'
import { User } from '@prisma/client'
import { ConversationType } from '@/app/types'
import { pusherClient } from '@/app/libs/pusher'
import { find } from 'lodash'
import { addConversations, deleteConversation, updateConversation } from '@/app/redux/conversation/slice'
import { toast } from 'react-hot-toast'

const Users = () => {
  // Getting data from redux store
  const { conversations } = useAppSelector((state) => state.conversation)
  const { user, mode } = useAppSelector((state) => state.user)

  const [groupModalOpen, setGroupModalOpen] = useState(false)
  const [allConversations, setAllConversations] = useState<ConversationType[]>([])
  const [sortedConversations, setSortedConversations] = useState<ConversationType[]>([])
  const [allUsers, setAllUsers] = useState<User[]>()

  const params = useParams()
  const dispatch = useAppDispatch()
  const router = useRouter()

  // Default values for group chat modal
  const defaultValues = {
    name: "",
    members: []
  }

  // Getting all users from the list of conversation
  const getAllUsers = () => {
    let allFinalUsers: User[] = []
    allConversations.map((conversation) => {
      if (!conversation.isGroup && user) {
        if (!conversation.isGroup && user) {
          const userData = conversation.users.filter((u: any) => u.id !== user?.id);
          allFinalUsers.push(userData[0]);
        }
      }
    })
    setAllUsers(allFinalUsers)
  }

  // SettingUp Initial Conversations
  useEffect(() => {
    if (conversations && conversations.length > 0) {
      setAllConversations(conversations)
    }
  }, [conversations])


  // For Handling Pusher Requests
  useEffect(() => {

    // Handle Realtime add new conversation
    function handleNewConversation(conversation: ConversationType) {
      if (conversation) {
        dispatch(addConversations(conversation))
        setAllConversations((current) => {
          if (find(current, { id: conversation.id }))
            return current
          return [conversation, ...current]
        })
      }
    }
    // Handle Realtime delete conversation
    function handleDeleteConversation(conversation: ConversationType) {
      if (conversation) {
        let otherConversations = allConversations.filter((c) => c.id !== conversation.id)
        setAllConversations(otherConversations)
        dispatch(deleteConversation(conversation))
        router.push('/chats')
        toast.error("Conversation Deleted")
      }
    }
    // Handle Realtime update in conversation List
    function handleUpdateConversation(conversation: ConversationType) {
      if (conversation) {
        setAllConversations((current) => current.map((conver) => {
          if (conver.id === conversation.id) {
            return { ...conver, lastMessageAt: conversation.lastMessageAt, messages: conversation.messages }
          }
          return conver
        }))
      }
    }
    // Handle Realtime update in group conversation
    function handleGroupConversationUpdate(conversation: ConversationType) {
      console.log(conversation)
      if (conversation) {
        dispatch(updateConversation(conversation))
        setAllConversations((current) => current.map((conver) => {
          if (conver.id === conversation.id) {
            return conversation
          }
          return conver
        }))
      }
      let allUsers = [...conversation.users]
      let isFound = false
      for (let u of allUsers) {
        if (user && u.id === user.id) {
          isFound = true;
          break;
        }
      }
      if (!isFound) {
        dispatch(deleteConversation(conversation))
        if (params && params.chatId === conversation.id)
          router.push('/chats')
      }
    }
    // Handles group conversation leave
    async function handleGroupLeaveConversation(conversation: ConversationType) {
      toast.success("Conversation Deleted")
      dispatch(deleteConversation(conversation))
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

  // Getting the sorted list of conversation
  useEffect(() => {
    if (allConversations.length > 0) {
      let updatedSortedConverstion = [...allConversations]
      updatedSortedConverstion.sort((a: ConversationType, b: ConversationType) => {
        let time1 = new Date(a.lastMessageAt).getTime()
        let time2 = new Date(b.lastMessageAt).getTime()

        return time2 - time1
      })
      setSortedConversations(updatedSortedConverstion)

      getAllUsers()
    }
  }, [allConversations])

  return (
    <>
      {conversations && allUsers && allUsers.length > 0 && <GroupCreateModal isOpen={groupModalOpen} onClose={() => setGroupModalOpen(false)} allUsers={allUsers} defaultValues={defaultValues} isUpdate={false} />}
      <aside className={`md:fixed md:w-80 md:left-16 md:pb-0 pb-16 md:block h-full ${params && params?.chatId ? 'hidden' : 'block'}`}>
        <div className={`flex justify-between items-center md:px-4 px-2 h-16 sticky top-0 z-10 shadow transition-colors duration-300 ease-in-out ${mode && mode === 'light' ? 'bg-light-1' : 'bg-dark-1 text-white'}`}>
          <div className='flex items-center gap-1'>
            <Image src={logo} height={32} width={32} alt='logo' className='md:hidden rounded' />
            <h3 className='font-semibold text-xl'>Chats</h3>
          </div>
          <span className='hover:bg-b-light1 hover:bg-opacity-30 p-1 cursor-pointer rounded-full' onClick={() => setGroupModalOpen(true)}>
            <AiOutlineUsergroupAdd size={28} />
          </span>
        </div>
        <div className={`flex flex-col overflow-auto scrollbar transition-colors duration-300 ease-in-out h-full md:pb-0 pb-16 ${mode && mode === 'light' ? 'bg-light-2' : 'bg-dark-2'}`}>
          {sortedConversations && sortedConversations.length > 0 ? sortedConversations.map((conversation, index) => (
            <UserBox conversation={conversation} key={index} />
          )) :
            <div className='flex justify-center items-center py-6'>
              <p className={`${mode === 'light' ? 'text-black' : 'text-gray-400'}`}>No Conversations Found</p>
            </div>}
        </div>
      </aside>
    </>
  )
}

export default Users