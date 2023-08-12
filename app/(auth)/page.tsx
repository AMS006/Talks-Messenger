'use client'
import Image from "next/image"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MdDarkMode, MdLightMode } from "react-icons/md"

import logo from '@/public/logo.png'
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import ForgotPassword from "./components/ForgotPassword"
import NewPassword from "./components/NewPassword"
import VerificationCode from "./components/VerificationCode"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setUserMode } from "@/redux/user/slice"

export default function Home() {
  const [activeRoute, setActiveRoute] = useState('signIn')
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const { mode } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!localStorage.mode) {
        localStorage.setItem("mode", "light")
        dispatch(setUserMode("light"))
    } else {
        dispatch(setUserMode(localStorage.getItem("mode") || ""))
    }
  }, [dispatch])

  const generateCode = () => {
    let newCode = String(Math.floor(100000 + Math.random() * 900000))
    setCode(newCode)
    return newCode;
  }
  const toggleMode = (val: string) => {
    dispatch(setUserMode(val))
    localStorage.setItem("mode", val)
  }
  const session = useSession()
  const router = useRouter()
  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/chats')
    }
  }, [session.status, session.data,router])
  return (
    <>
      <div className={`flex min-h-full flex-col  justify-center items-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 ease-in-out ${mode && mode === 'light' ? 'bg-light-2 text-black' : 'bg-dark-2 text-white'}`}>
        <div className="absolute top-4 right-4 ">
          {mode === "light" ? <button onClick={() => toggleMode("dark")}>
            <MdDarkMode size={28} />
          </button> :
            <button onClick={() => toggleMode("light")}>
              <MdLightMode size={28} />
            </button>}
        </div>
        <div className="flex flex-col justify-center items-center gap-1 py-2">
          <Image src={logo} alt="logo" width={48} height={48} />
        </div>
        {activeRoute === 'signIn' && <SignIn setActiveRoute={setActiveRoute} />}
        {activeRoute === 'signUp' && <SignUp setActiveRoute={setActiveRoute} />}
        {activeRoute === 'forgotPassword' && <ForgotPassword setActiveRoute={setActiveRoute} generateCode={generateCode} setEmail={setEmail} />}
        {activeRoute === 'verifyCode' && <VerificationCode setActiveRoute={setActiveRoute} code={code} email={email} />}
        {activeRoute === 'resetPassword' && <NewPassword setActiveRoute={setActiveRoute} email={email} />}
      </div>
    </>
  )
}