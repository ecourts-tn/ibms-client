import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api'

const initialState = {
    bailtypes: [],
    status: 'idle',
    error: null
}

export const getBailTypes = createAsyncThunk(
    'bailtype/getBailType',
    async () => {
        const response = await api.get("base/bail-type/")
        return response.data
    }
)

export const getBailTypeByCaseType = createAsyncThunk(
    'bailtype/getBailTypeByCaseType',
    async (id) => {
        const response = await api.get(`base/case-type/${id}/bail-type/`)
        return response.data
    }
)



const BailTypeSlice = createSlice({
    name: "bailtypes",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getBailTypes.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getBailTypes.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.bailtypes = action.payload
        })
        .addCase(getBailTypes.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
        .addCase(getBailTypeByCaseType.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getBailTypeByCaseType.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.bailtypes = action.payload
        })
        .addCase(getBailTypeByCaseType.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    }
})


export const getAllBailTypes = (state) => state.bailtypes.bailtypes

export const getBailTypeStatus = (state) => state.bailtypes.status

export const getBailTypeError = (state) => state.bailtypes.error

export default BailTypeSlice.reducer