import DesktopSidebar from './DesktopSidebar'
import BottomBarMobile from './BottomBarMobile'
import getUserDetails from '@/app/actions/getUserDetail'

const Sidebar = async ({ children }: { children: React.ReactNode }) => {

  const currUser = await getUserDetails()

  return (
    <div className='h-full'>
      {currUser && <DesktopSidebar  currUser={currUser} />}
      <BottomBarMobile />
      <main className='md:pl-16 h-full'>
        {children}
      </main>
    </div>
  )
}

export default Sidebar