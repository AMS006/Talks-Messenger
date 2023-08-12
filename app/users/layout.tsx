import Sidebar from "@/components/Sidebar/Sidebar"

const UsersLayout =  ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="text-black h-full w-full ">
            {/* @ts-expect-error Server Component */}
            <Sidebar>
                {children}
            </Sidebar>
        </div>
    )
}
export default UsersLayout