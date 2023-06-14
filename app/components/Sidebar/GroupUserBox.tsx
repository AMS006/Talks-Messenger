import { User } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import Avatar from 'react-avatar'

const GroupUserBox = ({ user }: { user: User }) => {

  return (
    <div className='border-b flex gap-3 py-2 items-center'>
      {user && <>
        {user.image ? <img src={user?.image} height={32} width={32} className='rounded-full h-[38px] w-[38px]' alt={'user'} /> :
          user.name && <Avatar name={user.name} size='32' round style={{ fontSize: '14px' }} />}
      </>}
      <h3 className='font-medium'>{user.name}</h3>
    </div>
  )
}

export default GroupUserBox