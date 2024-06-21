import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    benchtypes: [],
    status: 'idle',
    error: null
}

export const getBenchTypes = createAsyncThunk(
    'benchtype/getBenchTypes',
    async () => {
        const response = await api.get("api/base/bench-type/")
        return response.data
    }
);

const BenchTypeSlice = createSlice({
    name: 'benchtypes',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        .addCase(getBenchTypes.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getBenchTypes.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.benchtypes = action.payload
        })
        .addCase(getBenchTypes.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    },
});


export const getAllBenchTypes = (state) => state.benchtypes.benchtypes;
export const getBenchTypeStatus = (state) => state.benchtypes.status;
export const getBenchTypeError = (state) => state.benchtypes.error;

export default BenchTypeSlice.reducer