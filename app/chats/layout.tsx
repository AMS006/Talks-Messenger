import Sidebar from "@/components/Sidebar/Sidebar"
import Users from "./UserList/Users"

const ConversationsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
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