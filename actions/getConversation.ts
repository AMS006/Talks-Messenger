import prisma  from "../libs/prismaDb"
import getUserDetails from "./getUserDetail"

const getConversation = async(id:string) =>{
    try {
        const user = getUserDetails()

        if(!user)
            return null
        const conversation = await prisma.conversation.findUnique({where:{id}, include:{users:true}})
        if(!conversation)
            return undefined
  
        return conversation
    } catch (error) {
        return null
    }
}
export default getConversation