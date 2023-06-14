'use client'
import React from 'react'
import SearchUserBox from './SearchUserBox'
import { User } from '@prisma/client'


const SearchUserList = ({ users }: { users: User[] | undefined }) => {

  return (
    <>
      {users && <div className='grid md:grid-cols-2 grid-cols-1 gap-2'>
        {users.length > 0 && users?.map((user, index) => (
          <SearchUserBox user={user} key={index} />
        ))}
      </div>}
    </>
  )
}

export default SearchUserList