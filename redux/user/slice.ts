import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserType {
    myProfileBar: boolean,
    profileBar: boolean,
    mode: string,
    activeUsers: string[]
}
const initialState: UserType = {
    profileBar: false,
    myProfileBar: false,
    mode: "",
    activeUsers:[]
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
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
export const { setMyProfileBar, setProfileBar, setUserMode , setActiveUser, addActiveUser,removeActiveUser} = userSlice.actions

export default userSlice.reducer