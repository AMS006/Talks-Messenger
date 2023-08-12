import { ConversationType, MessageType } from "@/types"
import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'
export interface Conversations {
    loading: boolean
    conversations: ConversationType[]
    currConversation: ConversationType | undefined
    error: string
}
const initialState: Conversations = {
    conversations: [],
    currConversation: undefined,
    loading: false,
    error: ""
}
const isConversationPresent = (state: Conversations, conversation: ConversationType) => {
    let allConversations = state.conversations
    for (let i = 0; i < allConversations.length; i++) {
        if (allConversations[i].id === conversation.id)
            return true
    }
    return false;
}
const deleteConversationHandler = (state: Conversations, conversation: ConversationType) => {
    let updatedConversation = state.conversations.filter((c) => c.id !== conversation.id);

    return updatedConversation

}
const updateHandler = (state: Conversations, conversation: ConversationType) => {
    let isfound = false
    const updatedConversation = state.conversations.map((conver) => {
        if (conver.id === conversation.id) {
            isfound = true
            return conversation
        }
        return conver
    })
    if (!isfound)
        return [conversation, ...state.conversations]
    return updatedConversation

}
const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    
    reducers: {
        requestConversation: (state) => {
            state.loading = true
        },
        setAllConversations: (state, action: PayloadAction<ConversationType[]>) => {
            state.conversations = action.payload
            state.loading = false
        },
        addConversations: (state, action: PayloadAction<ConversationType>) => {
            state.loading = false
            const isPresent = isConversationPresent(current(state), action.payload)
            if (!isPresent)
                state.conversations.unshift(action.payload)
        },
        updateConversation: (state, action: PayloadAction<ConversationType>) => {
            state.loading = false
            const updatedConversation = updateHandler(current(state), action.payload)
            state.conversations = updatedConversation
            if (state.currConversation && state.currConversation.id === action.payload.id)
                state.currConversation = action.payload
        },
        setCurrConversation: (state, action: PayloadAction<ConversationType>) => {
            state.currConversation = action.payload
            state.loading = false
        },
        deleteConversation: (state, action: PayloadAction<ConversationType>) => {
            let updatedConversation = deleteConversationHandler(current(state), action.payload)
            state.conversations = updatedConversation
            state.loading = false
            if (state.currConversation && state.currConversation.id === action.payload.id)
                state.currConversation = undefined
        },
        addMessages: (state, action: PayloadAction<MessageType>) => {
            state.currConversation?.messages.push(action.payload)
            state.loading = false
        },
        clearMessages:(state) =>{
            state.currConversation?.messages.map(() =>{
                state.currConversation?.messages.pop()
            })
        }
    }

})
export const { setAllConversations, addMessages, clearMessages, addConversations, deleteConversation, setCurrConversation, updateConversation } = conversationSlice.actions

export default conversationSlice.reducer
