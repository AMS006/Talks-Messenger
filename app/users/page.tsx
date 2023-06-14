'use client'
import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import SearchUserList from './components/SearchUserList'
import axios from 'axios'
import { User } from '@prisma/client'
import Loader from '../components/Loader'
import { useAppSelector } from '../redux/hooks'

const Users = () => {
    const [searchUsers, setSearchUsers] = useState<User[]>()
    const [searchData, setSearchData] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false)

    const { conversations } = useAppSelector((state) => state.conversation)
    const { user, mode } = useAppSelector((state) => state.user)


    const getOtherUsers = () => {
        if (conversations) {
            const otherUsers = conversations.map((conversation) => {
                if (user && !conversation.isGroup) {
                    const userData = conversation.users.filter((cUser) => cUser.id !== user?.id)
                    return userData[0].id
                }
            })
            return new Set(otherUsers)
        }
    }
    const handleSearch = async () => {
        if (searchData) {
            setLoading(true)
            await axios.post('/api/searchUser', { searchData }).then(async (users) => {
                const allUser = users.data.users
                const otherUsers = getOtherUsers()
                if (otherUsers) {
                    const updatedUser = allUser.filter((user: User) => !otherUsers.has(user.id))
                    setSearchUsers(updatedUser)
                } else {
                    setSearchUsers(allUser)
                }
            }).finally(() => setLoading(false))
        }
    }
    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter')
            handleSearch()
    }
    useEffect(() => {
        const allUser = searchUsers
        const otherUsers = getOtherUsers()

        if (otherUsers && allUser && allUser.length > 0) {
            const updatedUser = allUser.filter((user: User) => !otherUsers.has(user.id))
            setSearchUsers(updatedUser)
        } else if (allUser) {
            setSearchUsers(allUser)
        }
    }, [conversations])
    return (
        <div className={`flex flex-col items-center transition-colors duration-300 ease-in-out w-full h-full p-4 overflow-y-auto ${mode && mode === 'light' ? 'bg-light-2' : 'bg-dark-2 text-white'}`}>
            <div className='flex justify-center shadow-lg rounded-full border overflow-hidden lg:w-2/5 md:w-3/5 sm:w-2/3 w-full'>
                <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchData}
                    required
                    placeholder='Search users by name or email'
                    className='form-input font-semibold text-gray-700'
                    style={{ borderRadius: '20px 0px 0px 20px', width: '90%' }}
                    onChange={(e) => setSearchData(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className='flex justify-center items-center font-semibold shadow cursor-pointer'
                    style={{ width: '10%' }}
                    onClick={handleSearch}
                >
                    <BiSearch size={20} />
                </button>
            </div>
            <div className='px-2 overflow-y-auto top-16 lg:w-2/5 md:w-3/5 sm:w-2/3 w-full py-4 scrollbar'>
                {loading ?
                    <div className='flex h-full py-8 justify-center items-center'>
                        <Loader height='40px' width='40px' />
                    </div> :
                    searchUsers?.length ?
                        <SearchUserList users={searchUsers} /> :
                        <div className='text-gray-400 font-semibold text-center'>No Users Found</div>
                }
            </div>
        </div>
    )
}

export default Users