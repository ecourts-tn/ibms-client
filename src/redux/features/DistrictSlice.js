import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    districts: [],
    status: 'idle',
    error: null
}

export const getDistricts = createAsyncThunk(
    'districts/getDistricts',
    async () => {
        const response = await api.get("api/base/district/")
        return response.data
    }
);


export const getDistrictByStateCode = createAsyncThunk(
    'district/getDistrictByState',
    async (state) => {
        const response = await api.get(`api/base/state/${state}/district/`)
        return response.data
    }
)



const DistrictSlice = createSlice({
    name: 'districts',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        .addCase(getDistricts.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getDistricts.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.districts = action.payload
        })
        .addCase(getDistricts.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
        builder
        .addCase(getDistrictByStateCode.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getDistrictByStateCode.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.districts = action.payload
        })
        .addCase(getDistrictByStateCode.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    },
});


export const getAllDistricts = (state) => state.districts.districts;
export const getDistrictsStatus = (state) => state.districts.status;
export const getDistrictsError = (state) => state.districts.error;

export const { loadDistricts } = DistrictSlice.actions
export default DistrictSlice.reducer