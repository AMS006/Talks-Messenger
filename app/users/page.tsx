import { redirect } from 'next/navigation'

import getUserDetails from '@/actions/getUserDetail'
import getConversations from '@/actions/getConversations'
import SearchBar from './components/SearchBar'

const Users = async() => {
    
    const conversations = await getConversations()
    const user = await getUserDetails()

    if(!user)
        return redirect('/')
    
    return (
        <SearchBar conversations={conversations} user={user} />
    )
}

export default Users