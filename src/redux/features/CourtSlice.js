import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

export const getCourts = createAsyncThunk(
    'court/getCourts',
    async () => {
      const response = await api.get('api/base/court/');
      return response.data;
    }
);

export const getCourtsByEstablishmentCode = createAsyncThunk(
  'courts/getCourtsByEstablishmentCode',
  async (establishment) => {
    const response = await api.get(`base/establishment/${establishment}/court/`)
    return response.data
  }
)

const initialState = {
    courts: [],
    status: 'idle',
    error: null,
  };


const CourtSlice = createSlice({
    name: 'courts',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
          .addCase(getCourts.pending, (state) => {
            state.status = 'loading';       
          })
          .addCase(getCourts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.courts = action.payload;
          })
          .addCase(getCourts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
          .addCase(getCourtsByEstablishmentCode.pending, (state) => {
            state.status = 'loading';       
          })
          .addCase(getCourtsByEstablishmentCode.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.courts = action.payload;
          })
          .addCase(getCourtsByEstablishmentCode.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
      },

});

export const getAllCourts = (state) => state.courts.courts;
export const getCourtsStatus = (state) => state.courts.status;
export const getCourtsError = (state) => state.courts.error;

export default CourtSlice.reducer