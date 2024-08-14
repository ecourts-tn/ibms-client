import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

export const getStates = createAsyncThunk(
    'states/getStates',
    async () => {
      const response = await api.get('base/state/');
      return response.data;
    }
);

const initialState = {
    states: [],
    status: 'idle',
    error: null,
  };


const StateSlice = createSlice({
    name: "states",
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
          .addCase(getStates.pending, (state) => {
            state.status = 'loading';        
          })
          .addCase(getStates.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.states = action.payload;
          })
          .addCase(getStates.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          });
      },

});

export const getAllStatess = (state) => state.states.states;
export const getStatesStatus = (state) => state.states.status;
export const getStatesError = (state) => state.states.error;

export default StateSlice.reducer