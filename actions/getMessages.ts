import prisma from '../libs/prismaDb'
const getMessages = async (conversationId: string) => {
    try {

        if (!conversationId)
            return [];

        const conversations = await prisma.message.findMany({
            where: { conversationId: conversationId },
            include: {
                sender: true,
            },
            orderBy: {
                createdAt: "asc"
            }
        })
        return conversations
    } catch (error) {
        return []
    }
}
export default getMessages