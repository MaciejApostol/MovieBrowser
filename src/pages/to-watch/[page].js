import React from "react";
import {connect} from "react-redux";
import {linkAdded} from "../../redux/linksSlice";
import {toWatchCleaned, toWatchDeleted} from "../../redux/toWatchSlice";
import {connectWithState} from "../favorites/[page]";

const ToWatchPage = (props) => connectWithState(props);

const mapStateToProps = (state) => {
    return {
        navLinks: state.links.navLinks,
        stateList: state.toWatch
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addLink: action => dispatch(linkAdded(action)),
        deleteElement: index => dispatch(toWatchDeleted(index)),
        clearList: () => dispatch(toWatchCleaned()),
    };
};

export const Head = () => <title>ToWatch</title>;

export default connect(mapStateToProps, mapDispatchToProps)(ToWatchPage);