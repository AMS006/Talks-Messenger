'use client'
import Header from './components/Header'
import InputBox from './components/InputBox'
import Body from './components/Body'

const page = () => {

  return (
    <>
      <div className='md:pl-80 h-full overflow-hidden md:static relative'>
        <div className='flex flex-col h-full md:border-l border-b-light1 overflow-y-auto'>
          <Header />
          <Body />
          <InputBox />
        </div>
      </div>
    </>
  )
}

export default page