import { redirect } from "next/navigation"

import Sidebar from "@/components/Sidebar/Sidebar"
import getUserDetails from "@/actions/getUserDetail"
import Users from "./UserList/Users"
import getConversations from "@/actions/getConversations"

const ConversationsLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getUserDetails()
    if (!user)
        redirect('/')

    const conversations = await getConversations()

    return (
        <div className="bg-light-2 text-black h-full">
            {/* @ts-expect-error Server Component */}
            <Sidebar>
                <div className="h-full">
                    <Users conversations={conversations} user={user} />
                    {children}
                </div>
            </Sidebar>
        </div>
    )
}
export default ConversationsLayout