import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import linkSlices from "./linksSlice";
import favoritesSlice from "./favoritesSlice";
import toWatchSlice from "./toWatchSlice";
import moviesSlice from "./moviesSlice";

const rootReducer = combineReducers({
    links: linkSlices,
    favorites: favoritesSlice,
    toWatch: toWatchSlice,
    movies: moviesSlice
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["favorites", "toWatch", "movies"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
});

const persistor = persistStore(store);
export {store, persistor};
