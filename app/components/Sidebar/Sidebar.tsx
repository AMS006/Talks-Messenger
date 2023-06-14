import DesktopSidebar from './DesktopSidebar'
import BottomBarMobile from './BottomBarMobile'
import getUserDetails from '@/app/actions/getUserDetail'
import getConversations from '@/app/actions/getConversations'

const Sidebar = async ({ children }: { children: React.ReactNode }) => {

  const currUser = await getUserDetails()
  const conversations = await getConversations()

  return (
    <div className='h-full'>
      {conversations && currUser && <DesktopSidebar newConversations={conversations} currUser={currUser} />}
      <BottomBarMobile />
      <main className='md:pl-16 h-full'>
        {children}
      </main>
    </div>
  )
}

export default Sidebar