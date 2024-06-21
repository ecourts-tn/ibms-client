import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    police_stations: [],
    status: 'idle',
    error: null
}

export const getPoliceSationByDistrict = createAsyncThunk(
    'police_station/getPoliceStationByDistrict',
    async (district) => {
        console.log(district)
        const response = await api.get(`api/base/district/${district}/police-station/`)
        // return JSON.parse(response.data)
        return response.data
    }
);


const PoliceStationSlice = createSlice({
    name: 'police_districts',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        .addCase(getPoliceSationByDistrict.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getPoliceSationByDistrict.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.police_stations = action.payload
        })
        .addCase(getPoliceSationByDistrict.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    },
});


export const getAllPoliceStations = (state) => state.police_stations.police_stations;
export const getPoliceStationsStatus = (state) => state.police_stations.status;
export const getPoliceStationsError = (state) => state.police_stations.error;


export default PoliceStationSlice.reducer