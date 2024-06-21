import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    complainttypes: [],
    status: 'idle',
    error: null
}

export const getComplaintTypes = createAsyncThunk(
    'complainttype/getComplaintTypes',
    async () => {
        const response = await api.get("api/base/complaint-type/")
        return response.data
    }
);



const ComplaintTypeSlice = createSlice({
    name: 'complainttypes',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        .addCase(getComplaintTypes.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getComplaintTypes.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.complainttypes = action.payload
        })
        .addCase(getComplaintTypes.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    },
});


export const getAllComplaintTypes = (state) => state.complainttypes.complainttypes;
export const getComplaintTypeStatus = (state) => state.complainttypes.status;
export const getComplaintTypeError = (state) => state.complainttypes.error;

export default ComplaintTypeSlice.reducer