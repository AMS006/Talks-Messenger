import React, { useState } from 'react'

import SearchUserBox from './SearchUserBox'
import { User } from '@prisma/client'

const SearchUserList = ({ users }: { users: User[] | undefined }) => {
  const [loadingConversation,setLoadingConversation] = useState<string>('')
  const [loading,setLoading] = useState(false);
  return (
    <>
      {users && <div className='grid md:grid-cols-2 grid-cols-1 gap-2'>
        {users.length > 0 && users?.map((user, index) => (
          <SearchUserBox 
              user={user} 
              key={index}
              loading={loading}
              setLoading={setLoading}
              loadingConversation={loadingConversation}
              setLoadingConversation={setLoadingConversation}
          />
        ))}
      </div>}
    </>
  )
}

export default SearchUserList