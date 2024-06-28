import {createSlice} from "@reduxjs/toolkit";
import {findInState, initialState} from "../state/initialState";

const {navLinks, subNavLinks} = initialState;
const linksSlices = createSlice({
        name: "links",
        initialState: {navLinks, subNavLinks},
        reducers: {
            linkAdded(state, action) {
                const {payload} = action;
                const {title, pathname} = payload;
                const link = findInState(state.navLinks, {key:"title", value:title});
                if (link === undefined) {
                    state.navLinks.push(payload);
                } else if (!link.pathname.includes(pathname)) {
                    link.pathname.push(pathname);
                }
            },
            linksAdded() {
                return initialState;
            },
            linksDeleted() {
                return {};
            }
        }
    }
);
export const {linksAdded, linkAdded, linksDeleted} = linksSlices.actions;
export default linksSlices.reducer;