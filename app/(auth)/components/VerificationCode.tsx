'use client'
import axios from 'axios';
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useAppSelector } from '@/redux/hooks';
import Input from '@/components/Input'

interface VerificationCodeProps {
    setActiveRoute: Dispatch<SetStateAction<string>>,
    code?: string
    email?: string
}
const VerificationCode = ({ setActiveRoute, code, email }: VerificationCodeProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            code: ''
        }
    });
    const { mode } = useAppSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setLoading(true)
        await axios.post('/api/verifyCode', { code: data.code, email }).then(() => {
            toast.success("Correct Code")
            setActiveRoute("resetPassword")
        }).catch((err) => {
            toast.error("Incorrect Code")
        }).finally(() => setLoading(false))
    }
    return (
        <div className={`flex flex-col items-center  rounded-lg py-4 lg:px-12 md:px-10 sm:px-8 px-4 sm:mx-0 mx-2 shadow-lg transition-colors duration-300 ease-in-out ${mode === 'dark' ?'bg-dark-1':'bg-light-1'}`}>
            <h1 className='font-semibold text-2xl py-2'>Verify Email Id</h1>
            <p className='text-xs py-4'>Enter the verification code send on your email to verify your account</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    type={'text'}
                    label={'Enter Verification Code'}
                    id={'code'}
                    placeholder='abc-xyz'
                    required={true}
                    register={register}
                    error={errors}
                    disabled={loading}
                />
                <div className='flex justify-end items-center gap-4 mt-2'>
                    <button
                        onClick={() => setActiveRoute('signIn')}
                        className={`w-full bg-transparent border border-white ${mode === 'dark' ?  'text-white':'text-black'} mt-4 rounded-lg py-2 font-semibold transition-colors duration-150 ease-in-out hover:bg-slate-300 hover:text-[#0d142c]`}
                        disabled={loading}
                    >Back to Login</button>
                    <button
                        type='submit'
                        className={`w-full bg-transparent border border-white ${mode === 'dark' ?  'text-white':'text-black'} mt-4 rounded-lg py-2 font-semibold transition-colors duration-150 ease-in-out hover:bg-slate-300 hover:text-[#0d142c]`}
                        disabled={loading}
                    >
                        {loading ? 'Vefifying...' : 'Verify'}</button>
                </div>

            </form>
            <div>

            </div>
        </div>
    )
}

export default VerificationCode
