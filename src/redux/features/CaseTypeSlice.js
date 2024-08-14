import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    casetypes: [],
    status: 'idle',
    error: null
}

export const getCaseTypes = createAsyncThunk(
    'casetype/getCaseTypes',
    async () => {
        const response = await api.get("base/case-type/")
        return response.data
    }
);



const CaseTypeSlice = createSlice({
    name: 'casetypes',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        .addCase(getCaseTypes.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getCaseTypes.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.casetypes = action.payload
        })
        .addCase(getCaseTypes.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    },
});


export const getAllCaseTypes = (state) => state.casetypes.casetypes;
export const getCaseTypeStatus = (state) => state.casetypes.status;
export const getCaseTypeError = (state) => state.casetypes.error;

export default CaseTypeSlice.reducer