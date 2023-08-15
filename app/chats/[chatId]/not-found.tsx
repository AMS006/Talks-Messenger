'use client'
import { useAppSelector } from "@/redux/hooks"

 
export default function NotFound() {

    const {mode} = useAppSelector((state) => state.user)

  return (
    <>
        <div className={`md:pl-80 h-full w-full flex flex-col justify-center items-center overflow-hidden md:static relative ${mode === 'dark' ?'bg-dark-1 text-white':'bg-light-1 text-black'}`}>
          <h2 className='font-semibold py-2 text-xl'>Not Found</h2>
          <p className="text-center px-2">Could Not Found the conversation as It may not exists or may be deleted</p>
        </div>
    </>
  )
}