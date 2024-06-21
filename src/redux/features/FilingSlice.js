import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    filing: [],
    status: 'idle',
    error: null
}

export const saveFiling = createAsyncThunk(
    'filing/saveFiling',
    async (filing) => {
        const response = await api.post("api/bail/filing/", filing)
        return response.data
    }
)

const FilingSlice = createSlice({
    name: 'filing',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        .addCase(saveFiling.pending, (state, action) => {
            state.status = 'loading'
        })
        builder
        .addCase(saveFiling.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // state.filing.filing = action.payload
        })
        builder
        .addCase(saveFiling.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    }
})

export const getAllFiling = (state) => state.filing.filing;
export const getFilingStatus = (state) => state.filing.status;
export const getFilingError = (state) => state.filing.error;


export default FilingSlice.reducer