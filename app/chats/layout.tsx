import axios from "axios"
import getConversations from "../actions/getConversations"
import getUserDetails from "../actions/getUserDetail"
import Sidebar from "../components/Sidebar/Sidebar"
import { ConversationType } from "../types"
import Users from "./UserList/Users"
import { useAppDispatch } from "../redux/hooks"
import { setAllConversations } from "../redux/conversation/slice"

const  ConversationsLayout = ({children}:{children:React.ReactNode}) =>{

    
    return(
        <div className="bg-light-2 text-black h-full">
            {/* @ts-expect-error Server Component */}
                <Sidebar>
                    <div className="h-full">
                        <Users />
                        {children}
                    </div>
                </Sidebar>
        </div>
    )
}
export default ConversationsLayout