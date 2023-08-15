import DesktopSidebar from './DesktopSidebar'
import BottomBarMobile from './BottomBarMobile'
import getUserDetails from '@/actions/getUserDetail'
import { redirect } from 'next/navigation'

const Sidebar = async ({ children }: { children: React.ReactNode }) => {

  const user = await getUserDetails()

  if (!user)
    redirect('/')

  return (
    <div className='h-full'>
      <DesktopSidebar user={user} />
      <BottomBarMobile user={user} />
      <main className='md:pl-16 h-full'>
        {children}
      </main>
    </div>
  )
}

export default Sidebar