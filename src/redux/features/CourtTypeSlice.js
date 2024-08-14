import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    courttypes: [],
    status: 'idle',
    error: null
}

export const getCourtTypes = createAsyncThunk(
    'courttype/getCourtTypes',
    async () => {
        const response = await api.get("base/court-type/")
        return response.data
    }
);



const CourtTypeSlice = createSlice({
    name: 'courttypes',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        .addCase(getCourtTypes.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getCourtTypes.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.courttypes = action.payload
        })
        .addCase(getCourtTypes.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    },
});


export const getAllCourtTypes = (state) => state.courttypes.courttypes;
export const getCourtTypeStatus = (state) => state.courttypes.status;
export const getCourtTypeError = (state) => state.courttypes.error;

export default CourtTypeSlice.reducer