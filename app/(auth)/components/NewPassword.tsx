'use client'
import axios from 'axios';
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast'

import Input from '@/components/Input'
import { useAppSelector } from '@/redux/hooks';

interface NewPasswordProps {
    setActiveRoute: Dispatch<SetStateAction<string>>
    email: string
}
const NewPassword = ({ setActiveRoute, email }: NewPasswordProps) => {
    const [loading, setIsLoading] = useState(false)
    const { mode } = useAppSelector((state) => state.user)
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            newPassword: '',
            confirmPassword: ''
        }
    });
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true)
        if (data.newPassword === data.confirmPassword) {
            const userData = {
                email,
                password: data.newPassword
            }
            await axios.put("/api/updatePassword", userData).then(() => {
                toast.success("Reset Password Success")
                setActiveRoute("signIn")
            }).catch(() => toast.error("Unable to reset password")).finally(() => setIsLoading(false))
        }
        else {
            toast.error("Passwords does not match")
            setIsLoading(false)
        }
    }

    return (
        <>
            <p className='pb-2.5'>Create a New Password to continue on Talks Messenger</p>
            <div className={`flex flex-col items-center rounded-lg py-4 lg:px-12 md:px-10 sm:px-8 px-4 sm:mx-0 mx-2 shadow-lg transition-colors duration-300 ease-in-out ${mode === 'dark' ? 'bg-dark-1' : 'bg-light-1'}`}>
                <h1 className='font-semibold text-2xl py-2'>Reset Password</h1>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    <Input
                        type={'password'}
                        label={'Enter New Password'}
                        id={'newPassword'}
                        placeholder='New Password'
                        required={true}
                        register={register}
                        error={errors}
                        disabled={loading}
                    />
                    <Input
                        type={'password'}
                        label={'Enter Confirm Password'}
                        id={'confirmPassword'}
                        placeholder='Confirm Password'
                        required={true}
                        register={register}
                        error={errors}
                        disabled={loading}
                    />
                    <div className='flex justify-end items-center gap-4'>
                        <button
                            onClick={() => setActiveRoute('signIn')}
                            className={`w-full bg-transparent border border-white ${mode === 'dark' ? 'text-white' : 'text-black'} mt-4 rounded-lg py-2 font-semibold transition-colors duration-150 ease-in-out hover:bg-slate-300 hover:text-[#0d142c] ${loading ? 'opacity-50 cursor-default' : ''}`}
                            disabled={loading}
                        >
                            Back to Login</button>
                        <button
                            type='submit'
                            className={`w-full bg-transparent border border-white ${mode === 'dark' ? 'text-white' : 'text-black'} mt-4 rounded-lg py-2 font-semibold transition-colors duration-150 ease-in-out hover:bg-slate-300 hover:text-[#0d142c] ${loading ? 'opacity-50 cursor-default' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset'}</button>
                    </div>

                </form>
            </div>
        </>
    )
}

export default NewPassword
