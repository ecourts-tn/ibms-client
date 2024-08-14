import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    accused: [],
    status: 'idle',
    error: null
}

export const getAccusedDetails = createAsyncThunk(
    'accused/getAccusedDetails',
    async (data) => {
        const response = await api.get("external/police/tamilnadu/accused-details/", {data:data})
        return response.data
    }
);


const AccusedSlice = createSlice({
    name: 'accused',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        .addCase(getAccusedDetails.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getAccusedDetails.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.accused = action.payload
        })
        .addCase(getAccusedDetails.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    },
});


export const getAllAccused = (state) => state.accused.accused;
export const getAccusedStatus = (state) => state.accused.status;
export const getAccusedError = (state) => state.accused.error;


export default AccusedSlice.reducer