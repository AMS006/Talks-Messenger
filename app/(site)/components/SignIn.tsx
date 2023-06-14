'use client'
import { useState } from 'react'
import React, { Dispatch, SetStateAction } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast';
import Input from './Input'
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/redux/hooks';

interface signInProps {
    setActiveRoute: Dispatch<SetStateAction<string>>
}
function SignIn({ setActiveRoute }: signInProps) {

    const router = useRouter()

    const [loading, setIsLoading] = useState(false)
    const { mode } = useAppSelector((state) => state.user)

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)
        signIn('credentials', { ...data, redirect: false }).then((callback) => {
            if (callback?.error)
                toast.error("Invalid Credentials")
            if (callback?.ok && !callback?.error) {
                router.push('/chats')
                toast.success("LogedIn Successfully")
            }
        }).finally(() => setIsLoading(false))
    }
    const handleGoogleSignIn = () => {
        signIn('google', { redirect: false }).then((callback) => {
            if (callback?.error)
                toast.error("Invalid Credentials")

            if (callback?.ok && !callback?.error)
                toast.success("LogedIn Successfully")
        })


    }
    return (
        <div className={`flex flex-col items-center rounded-lg py-4 lg:px-12 md:px-10 sm:px-8 px-4 sm:mx-0 mx-2 shadow-lg transition-colors duration-300 ease-in-out ${mode && mode === 'light' ? 'bg-light-1' : 'bg-dark-1'}`}>
            <h1 className='font-semibold text-2xl'>Sign In</h1>
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                    <Input
                        type={'email'}
                        label={'Enter Your Email'}
                        id={'email'}
                        placeholder='johndeo@gmail.com'
                        required={true}
                        register={register}
                        error={errors}
                        disabled={loading}
                    />
                    <Input
                        type={'password'}
                        label={'Enter Your Password'}
                        id={'password'}
                        placeholder='password'
                        required={true}
                        register={register}
                        error={errors}
                        disabled={loading}
                    />
                    <button
                        type='submit'
                        className={`w-full bg-transparent border border-white ${mode && mode === 'light' ? 'text-black' : 'text-white'} mt-4 rounded-full py-2 font-semibold transition-colors duration-150 ease-in-out hover:bg-slate-300 hover:text-[#0d142c] ${loading ? 'cursor-default opacity-50' : ''}`}
                        disabled={loading}
                    >
                        {!loading ? 'Login' : 'Signing...'}</button>

                </form>
                <div className='text-center w-full pt-4'>
                    <button
                        onClick={() => setActiveRoute('forgotPassword')}
                        className={`text-sm font-semibold hover:underline ${mode && mode === 'light' ? 'text-gray-600' : 'text-white'} ${loading ? 'cursor-default opacity-50' : ''}`}
                        disabled={loading}
                    >Forgot Password?
                    </button>
                </div>
                <button
                    className={`flex justify-center items-center gap-2 w-full bg-transparent border border-white ${mode === 'light' ? 'text-black' : 'text-white'} mt-4 rounded-full py-2 font-semibold transition-colors duration-150 ease-in-out hover:bg-slate-300 hover:text-[#0d142c] ${loading ? 'cursor-default opacity-50' : ''}`}
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                >
                    <FcGoogle size={22} />
                    <span>Continue with Google</span>
                </button>
                <div className='text-center w-full pt-2'>
                    <div className={`text-sm ${mode === 'light' ? 'text-black' : 'text-white'}`}>Don't Have Account?&nbsp;
                        <button
                            className={`font-semibold text-[#4b5cff] hover:underline ${loading ? 'cursor-default opacity-50' : ''}`}
                            onClick={() => setActiveRoute('signUp')}
                            disabled={loading}
                        >Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn
