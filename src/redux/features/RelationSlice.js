import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

const initialState = {
    relations: [],
    status: 'idle',
    error: null
}

export const getRelations = createAsyncThunk(
    'relation/getRelation',
    async () => {
        const response = await api.get("base/relation/")
        return response.data
    }
)

const RelationSlice = createSlice({
    name: "relations",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getRelations.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getRelations.fulfilled, (state, action) => {
            state.relations = action.payload
            state.status = 'succeeded'
        })
        .addCase(getRelations.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    }
})

export const getAllRelations = (state) => state.relations.relations
export const getRelationStatus = (state) => state.relations.status
export const getRelationError = (state) => state.relations.error

export default RelationSlice.reducer