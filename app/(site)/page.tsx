'use client'
import Image from "next/image"
import logo from '../../public/logo.png'
import { useState, useEffect } from "react"
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import ForgotPassword from "./components/ForgotPassword"
import NewPassword from "./components/NewPassword"
import VerificationCode from "./components/VerificationCode"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { MdDarkMode, MdLightMode } from "react-icons/md"
import { setUserMode } from "../redux/user/slice"


export default function Home() {
  const [activeRoute, setActiveRoute] = useState('signIn')
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const { mode } = useAppSelector((state) => state.user)
  const generateCode = () => {
    let newCode = String(Math.floor(100000 + Math.random() * 900000))
    setCode(newCode)
    return newCode;
  }
  const dispatch = useAppDispatch()
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
  }, [session.status, session.data])
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
        <div className="flex flex-col justify-center items-center gap-1 py-4">
          <Image src={logo} alt="logo" width={48} height={48} />
          <h1 className="text-xl font-semibold">Sign In to Your Account</h1>
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