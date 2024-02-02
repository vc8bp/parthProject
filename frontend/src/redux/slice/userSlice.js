import { createSlice } from '@reduxjs/toolkit'
const user = localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData'))
const initialState = {
    info: user,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        LoginUser: (state, action) => {
            state.info = {...action.payload, avatar: action.payload.avatar ? `${import.meta.env.VITE_BACKEND_AVATAR}/${action.payload.avatar}` : null};
            localStorage.setItem("userData", JSON.stringify(action.payload))
        },
        LogoutUser: (state) => {
            state.info = null
            localStorage.removeItem("userData")
        },
        updateUser: (state, action) => {
            const newPayload = {...state.info, ...action.payload}
            newPayload.avatar = action.payload?.avatar?.includes("avatar") ? `${import.meta.env.VITE_BACKEND_AVATAR}/${action.payload.avatar}` : null
            state.info = newPayload
            localStorage.setItem('userData', JSON.stringify(state.info));  
        }
    },
})


export const { LoginUser, LogoutUser, updateUser } = userSlice.actions

export default userSlice.reducer