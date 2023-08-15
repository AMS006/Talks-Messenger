import Header from './components/Header'
import InputBox from './components/InputBox'
import Body from './components/Body'
import getConversation from '@/actions/getConversation'
import getMessages from '@/actions/getMessages'
import getUserDetails from '@/actions/getUserDetail'
import { notFound, redirect } from 'next/navigation'
import getConversations from '@/actions/getConversations'

const page = async({params}:{params:{chatId:string}}) => {

  const conversations = await getConversations()
  const conversation = await getConversation(params.chatId)
  const messages = await getMessages(params.chatId)
  const user = await getUserDetails()

  if(!conversation){
    return notFound()
  }

  if(!user){
    return redirect('/')
  }

  return (
    <>
      <div className='md:pl-80 h-full overflow-hidden md:static relative'>
        {conversations && <div className='flex flex-col h-full border-b-light1 overflow-y-auto'>
          <Header conversation={conversation} user={user} conversations={conversations}/>
          <Body conversation={conversation} initialMessages={messages} chatId={params.chatId} user = {user}/>
          <InputBox />
        </div>}
      </div>
    </>
  )
}

export default page