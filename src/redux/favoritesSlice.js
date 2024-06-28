import {createSlice} from "@reduxjs/toolkit";

export const findById = (state, id) => state.find(element => element.id === id);
export const reducers = {
    elementAdded(state, action) {
        if (!findById(state, action.payload.id)) {
            return [...state, action.payload];
        }
    },
    elementDeleted(state, action) {
        const movie = findById(state, action.payload);
        const index = state.indexOf(movie);
        state.splice(index, 1);
    },
    stateCleaned() {
        return [];
    }
}
export const createSliceWithName = (name) => {
    return createSlice({
        name,
        initialState: [],
        reducers
    });
};

const favoritesSlice = createSliceWithName("favorites");

export const {
    elementAdded: favoriteAdded, elementDeleted: favoriteDeleted,
    stateCleaned: favoritesCleaned
} = favoritesSlice.actions;

export default favoritesSlice.reducer;