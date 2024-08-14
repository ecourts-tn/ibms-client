import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    prisons:[],
    status: 'idle',
    error: null
}

export const getPrisons =  createAsyncThunk(
    'prisons/getPrisons',
    async () => {
        const response = await api.get("base/prison/")
        return response.data
    }
)

export const getPrisonsByDistrict = createAsyncThunk(
    'prisons/getPrisionsByDistrict',
    async (district) => {
        const response = await api.get(`api/base/district/${district}/prison/`)
        return response.data
    }
)

export const PrisonSlice = createSlice({
    name: "prisons",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getPrisons.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getPrisons.fulfilled, (state, action) => {
            state.prisons = action.payload
            state.status = 'succeeded'
        })
        .addCase(getPrisons.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
        .addCase(getPrisonsByDistrict.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getPrisonsByDistrict.fulfilled, (state, action) => {
            state.prisons = action.payload
            state.status = 'succeeded'
        })
        .addCase(getPrisonsByDistrict.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    }
})

export const getAllPrisons = (state) => state.prisons.prisons
export const getPrisonsStatus = (state) => state.prisons.status
export const getPrisonsError = (state) => state.prisons.error

export default PrisonSlice.reducer;