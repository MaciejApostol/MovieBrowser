import {createSliceWithName, findById, reducers} from "./favoritesSlice";
import {createSlice} from "@reduxjs/toolkit";

const moviesSlice = createSlice({
    name: "movies",
    initialState: [],
    reducers:
        {
            ...reducers,
            movieSoftDeleted(state, action) {
                const {id} = action.payload;
                const index = state.indexOf(findById(state, id));
                state[index].deleted = true;
            }
        }
});
export const {
    elementAdded: movieAdded, elementDeleted: movieDeleted,
    stateCleaned: movieCleaned, movieSoftDeleted
} = moviesSlice.actions;
export default moviesSlice.reducer;
