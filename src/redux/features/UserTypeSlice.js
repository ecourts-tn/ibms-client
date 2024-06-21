import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    usertypes: [],
    status: 'idle',
    error: null
}

export const getUserTypes = createAsyncThunk(
    'usertype/getUserType',
    async () => {
        const response = await api.get("api/base/user-type/")
        return response.data
    }
)


const UserTypeSlice = createSlice({
    name: 'usertypes',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder 
        .addCase(getUserTypes.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getUserTypes.fulfilled, (state, action) => {
            state.usertypes = action.payload
            state.status = 'succeeded'
        })
        .addCase(getUserTypes.rejected, (state, action) => {
            state.status ='failed'
            state.error = action.error.message
        })
    }
})


export const getAllUserTypes = (state) => state.usertypes.usertypes
export const getUserTypeStatus = (state) => state.usertypes.status
export const getUserTypeError = (state) => state.usertypes.error

export default UserTypeSlice.reducer