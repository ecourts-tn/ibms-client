import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    establishments: [],
    status: 'idle',
    error: null
}

export const getEstablishments = createAsyncThunk(
    'establishment/getEstablishment',
    async () => {
        const response = await api.get("base/establishment/")
        return response.data
    }
)

export const getEstablishmentByDistrict = createAsyncThunk(
    'establishment/getEstablishmentByDistrict',
    async (district) => {
        const response = await api.get(`base/district/${district}/establishment/`)
        return response.data
    }
)

const EstablishmentSlice = createSlice({
    name: "establishments",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getEstablishments.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getEstablishments.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.establishments = action.payload
        })
        .addCase(getEstablishments.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
        .addCase(getEstablishmentByDistrict.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getEstablishmentByDistrict.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.establishments = action.payload
        })
        .addCase(getEstablishmentByDistrict.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    },
})


export const getAllEstablishments       = (state) => state.establishments.establishments;
export const getEstablishmentsStatus    = (state) => state.establishments.status;
export const getEstablishmnetsError     = (state) => state.establishments.error;

export default EstablishmentSlice.reducer