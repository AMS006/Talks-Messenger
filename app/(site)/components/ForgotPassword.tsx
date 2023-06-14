'use client'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from './Input'
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAppSelector } from '@/app/redux/hooks';

interface forgotPasswordProps {
    setActiveRoute: Dispatch<SetStateAction<string>>
    generateCode: () => string
    setEmail: Dispatch<SetStateAction<string>>
}
const ForgotPassword = ({ setActiveRoute, generateCode, setEmail }: forgotPasswordProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            email: ''
        }
    });
    const [loading, setIsLoading] = useState(false)
    const { mode } = useAppSelector((state) => state.user)
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true)
        setEmail(data.email)
        await axios.post('/api/forgotPassword', data).then((data) => {
            if (data) {
                toast.success("Verification Code Send to Email")
                setActiveRoute('verifyCode')
            }
        }).catch((err) => {
            toast.error("User Not Found")
        }).finally(() => setIsLoading(false))
    }

    return (
        <div className={`flex flex-col items-center  rounded-lg py-4 lg:px-12 md:px-10 sm:px-8 px-4 sm:mx-0 mx-2 shadow-lg transition-colors duration-300 ease-in-out ${mode && mode === 'light' ? 'bg-light-1' : 'bg-dark-1'}`}>
            <h1 className='font-semibold text-2xl py-2'>Reset Password</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    type={'email'}
                    label={'Enter New Email'}
                    id={'email'}
                    placeholder='johndeo@gmail.com'
                    required={true}
                    register={register}
                    error={errors}
                    disabled={loading}
                />
                <div className='flex justify-end items-center gap-4 mt-2'>
                    <button
                        onClick={() => setActiveRoute('signIn')}
                        className={`${loading ? 'opacity-50 cursor-default' : ''} w-full bg-transparent border border-white ${mode === 'light' ? 'text-black' : 'text-white'} mt-4 rounded-lg py-2 font-semibold transition-colors duration-150 ease-in-out hover:bg-slate-300 hover:text-[#0d142c]`}
                        disabled={loading}
                    >
                        Back to Login</button>
                    <button
                        type='submit'
                        className={`${loading ? 'opacity-50 cursor-default' : ''} w-full bg-transparent border border-white ${mode === 'light' ? 'text-black' : 'text-white'} mt-4 rounded-lg py-2 font-semibold transition-colors duration-150 ease-in-out hover:bg-slate-300 hover:text-[#0d142c]`}
                        disabled={loading}
                    >
                        {!loading ? 'Submit' : 'Verifying...'}</button>
                </div>

            </form>
            <div>

            </div>
        </div>
    )
}

export default ForgotPassword
