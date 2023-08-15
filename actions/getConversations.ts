import prisma from '../libs/prismaDb'
import getUserDetails from './getUserDetail'

const getConversations = async () => {
    try {
        const currentUser = await getUserDetails()
        if(!currentUser)
            return []
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: "desc"
            },
            where: {
                userIds: {
                    has: currentUser?.id
                }
            },
            include: {
                users: true,
                messages: {
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        sender: true
                    }
                }
            }
        })
        if(!conversations)
            return []
        return conversations
    } catch (error) {
        throw new Error("Invalid Request")
    }
}
export default getConversations