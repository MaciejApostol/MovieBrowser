import {createSliceWithName} from "./favoritesSlice";

const toWatchSlice = createSliceWithName("toWatch");

export const {
    elementAdded: toWatchAdded, elementDeleted: toWatchDeleted,
    stateCleaned: toWatchCleaned
} = toWatchSlice.actions;

export default toWatchSlice.reducer;