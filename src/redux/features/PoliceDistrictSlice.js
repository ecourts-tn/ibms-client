import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    police_districts: [],
    status: 'idle',
    error: null
}

export const getPoliceDistricts = createAsyncThunk(
    'police_districts/getPoliceDistricts',
    async () => {
        const response = await api.get("api/external/get-tn-districts/")
        return JSON.parse(response.data)
    }
);


const PoliceDistrictSlice = createSlice({
    name: 'police_stations',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        .addCase(getPoliceDistricts.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getPoliceDistricts.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.police_districts = action.payload
        })
        .addCase(getPoliceDistricts.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    },
});


export const getAllPoliceDistricts = (state) => state.police_districts.police_districts;
export const getPoliceDistrictsStatus = (state) => state.police_districts.status;
export const getPoliceDistrictsError = (state) => state.police_districts.error;


export default PoliceDistrictSlice.reducer