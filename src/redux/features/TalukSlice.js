import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";


const initialState = {
    taluks: [],
    status: 'idle',
    error: null
}

export const getTaluks = createAsyncThunk(
    'taluks/getTaluks',
    async () => {
        const response = await api.get("base/taluk/")
        return response.data
    }
)

export const getTalukByDistrictCode = createAsyncThunk(
    'taluk/getTalukByDistrictCode',
    async(district) => {
        const response = await api.get(`api/base/district/${district}/taluk/`)
        return response.data
    }
)

const TalukSlice = createSlice({
    name: "taluks",
    initialState,
    reducers:{
       
    },
    extraReducers: (builder) => {
        builder
        .addCase(getTaluks.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getTaluks.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.taluks = action.payload
        }) 
        .addCase(getTaluks.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
        .addCase(getTalukByDistrictCode.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getTalukByDistrictCode.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.taluks = action.payload
        }) 
        .addCase(getTalukByDistrictCode.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    }
})


export const getAllTaluks = (state) => state.taluks.taluks
export const getTaluksStatus = (state) => state.taluks.status
export const getTaluksError = (state) => state.taluks.error

export default TalukSlice.reducer;