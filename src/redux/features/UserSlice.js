import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    user: [],
    status: 'idle',
    error: null
}


const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loadUser: (state, action) => {
            state.user.push(action.payload)
        }
    }
})

export const { loadUser } = UserSlice.actions;

export default UserSlice.reducer