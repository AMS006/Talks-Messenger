'use client'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import Avatar from 'react-avatar';
import { signOut } from 'next-auth/react'
import { BiArrowBack } from 'react-icons/bi'
import { MdOutlineEdit } from 'react-icons/md'
import { FiCheck } from 'react-icons/fi'
import { BsFillCameraFill } from 'react-icons/bs'
import { CldUploadButton } from 'next-cloudinary'
import Image from 'next/image'

import Loader from '../Loader'
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrUser, setMyProfileBar } from '@/redux/user/slice';

function MyProfileBar() {
    const [name, setName] = useState<string>('')
    const [image, setImage] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const { user, myProfileBar, mode } = useAppSelector((state) => state.user)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (user && user.name && user.email) {
            setName(user.name)
            setEmail(user.email)
            if (user.image)
                setImage(user.image)
        }
    }, [user])
    const handleClick = async () => {
        if (disabled) {
            setDisabled(false)
            inputRef.current?.focus()
            inputRef.current?.contentEditable
        } else {
            setLoading(true)
            const data = {
                email,
                name,
                image
            }
            await axios.put('/api/updateUser', data).finally(() => setLoading(false))
            setDisabled(true)
        }
    }
    const handleUpload = async (result: any) => {
        setImage(result?.info?.secure_url)
        const data = {
            email,
            name,
            image: result.info.secure_url
        }
        await axios.put('/api/updateUser', data).then((data) => {
            const user = data.data.user
            dispatch(setCurrUser(user))
        })
    }
    return (
        <div className={`absolute top-0 md:left-16 left-0 md:w-80 w-full h-full z-30 transition-all duration-300 ease-out ${mode && mode === 'light' ? 'bg-light-1' : 'bg-dark-2 text-white'} ${myProfileBar ? 'translate-x-0 border-r border-light-1' : '-translate-x-full'}`}>
            <div className={`flex items-center gap-4 px-2 h-16 ${mode && mode === 'light' ? 'bg-light-2' : 'bg-dark-1 text-white'}`}>
                <button className='hover:bg-b-light1 hover:bg-opacity-30 p-2 rounded-full' onClick={() => dispatch(setMyProfileBar(false))}>
                    <BiArrowBack size={24} />
                </button>
                <h2 className='font-semibold text-lg'>Profile</h2>
            </div>
            <div className='py-8 flex flex-col gap-4 w-full'>
                <div className='relative w-full flex justify-center'>
                    <div className='relative'>
                        {user && user.image ? <Image height={80} width={80} src={user.image} alt="" className='rounded-full p-1 hover:bg-opacity-40' /> :
                            user && user.name && <Avatar name={user.name} round size='80' />}
                        <div className='absolute bottom-0 right-0 bg-[#6d94c6] rounded-full px-1.5 pt-1.5'>
                            <CldUploadButton
                                options={{ maxFiles: 1 }}
                                onUpload={handleUpload}
                                uploadPreset="foafbmjm"
                            >
                                <BsFillCameraFill size={18} />
                            </CldUploadButton>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-10 px-2'>
                    <div className='flex flex-col gap-3'>
                        <label htmlFor="name" className='text-sm  text-[#6d94c6] font-semibold'>Your Name</label>
                        <div className='relative flex justify-between items-center w-full'>
                            {user && <input
                                type="text"
                                name="name"
                                id="name"
                                value={name}
                                ref={inputRef}
                                contentEditable={false}

                                className={`${mode && mode === 'light' ? 'bg-light-1' : 'bg-transparent'} py-2 w-full transition-colors duration-300 ease-in-out focus:outline-none border-b ${disabled ? 'border-black cursor-default' : 'border-b-light1'}`}
                                onChange={(e) => !disabled && setName(e.target.value)}
                            />}
                            <button className='text-[#6d94c6]' onClick={handleClick} >
                                {disabled ?
                                    <MdOutlineEdit size={20} /> :
                                    !loading ?
                                        <FiCheck size={28} /> :
                                        <Loader height={'20px'} width={'20px'} />}
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <label htmlFor="email" className='text-[#6d94c6] text-sm font-semibold'>Your Email</label>
                        <h6 className='font-semibold py-2 border-b border-black'>{email}</h6>
                    </div>
                    <div className='flex justify-center md:hidden'>
                        <button
                            className='border px-2 py-2 rounded shadow shadow-white font-semibold'
                            onClick={() => signOut()}
                        >
                            Logout
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfileBar