import { User } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserType {
    user: User | undefined
    loading: boolean
    myProfileBar: boolean,
    profileBar: boolean,
    mode: string,
    error: string,
    activeUsers: string[]
}
const initialState: UserType = {
    user: undefined,
    loading: false,
    profileBar: false,
    myProfileBar: false,
    mode: "",
    error: "",
    activeUsers:[]
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        setMyProfileBar: (state, action: PayloadAction<boolean>) => {
            state.myProfileBar = action.payload
        },
        setProfileBar: (state, action: PayloadAction<boolean>) => {
            state.profileBar = action.payload
        },
        setUserMode: (state, action: PayloadAction<string>) => {
            state.mode = action.payload
        },
        setActiveUser: (state,action:PayloadAction<string[]>) =>{
            state.activeUsers = action.payload
        },
        addActiveUser:(state,action:PayloadAction<string>)=>{
            state.activeUsers.push(action.payload)
        },
        removeActiveUser:(state,action:PayloadAction<string>) =>{
            state.activeUsers = state.activeUsers.filter((user) => user != action.payload)
        }
    }
})
export const { setCurrUser, setMyProfileBar, setProfileBar, setUserMode , setActiveUser, addActiveUser,removeActiveUser} = userSlice.actions

export default userSlice.reducer