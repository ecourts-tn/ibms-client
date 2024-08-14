import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    fir: [],
    status: 'idle',
    error: null
}

export const getBasicDetails = createAsyncThunk(
    'fir/getBasicDetails',
    async (data) => {
        const response = await api.get("external/police/tamilnadu/fir-details/", {data:data})
        return response.data
    }
);


const FIRSeachSlice = createSlice({
    name: 'fir',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        .addCase(getBasicDetails.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getBasicDetails.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.fir = action.payload
        })
        .addCase(getBasicDetails.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    },
});


export const getAllFir = (state) => state.fir.fir;
export const getFirStatus = (state) => state.fir.status;
export const getFirError = (state) => state.fir.error;


export default FIRSeachSlice.reducer