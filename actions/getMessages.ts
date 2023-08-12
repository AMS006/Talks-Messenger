import prisma from '../libs/prismaDb'
const getMessages = async (conversationId: string) => {
    try {

        if (!conversationId)
            return null;

        const conversations = await prisma.message.findMany({
            where: { conversationId: conversationId },
            include: {
                sender: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return conversations
    } catch (error) {
        throw new Error("Invalid Request")
    }
}
export default getMessages