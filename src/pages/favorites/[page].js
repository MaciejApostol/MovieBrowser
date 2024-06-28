import React from "react";
import {connect} from "react-redux";
import {navigate} from "gatsby";
import Button from "react-bootstrap/Button";
import {linkAdded} from "../../redux/linksSlice";
import {favoriteDeleted, favoritesCleaned} from "../../redux/favoritesSlice";
import PaginationComponent from "../../components/Pagination";
import {findInState} from "../../state/initialState";

const path = require("path");
export const connectWithState = (props) => {
    const {stateList, deleteElement, clearList, uri} = props;
    let {page} = props;
    const dirname = path.dirname(uri) + "/";

    page = parseInt(page);
    if (isNaN(page)) {
        navigate("/404/");
    }

    const length = stateList.length;
    if (length === 0 && page !== 1) {
        navigate("/404/");
    }

    const moviesOnPage = 20;
    const max = length > 0 ? Math.ceil(length / moviesOnPage) : 0;
    if (length > 0 && page > max) {
        navigate("/404/");
    }

    const handleDelete = (movie) => {
        deleteElement(movie.id);
    };

    return length ?
        <>
            <h1>Favorites films</h1>
            <Button onClick={() => clearList()}>Clean</Button>
            <ol>
                {stateList.slice((page - 1) * moviesOnPage, page * moviesOnPage).map((movie, index) => {
                    return (
                        <>
                            <li key={index}>{movie.title}</li>
                            <Button onClick={() => handleDelete(movie)}>Delete</Button>
                        </>
                    );
                })}
            </ol>
            {max >= 2 && <PaginationComponent pathname={dirname} activePage={page} max={max}/>}
        </> :
        <>
            <h1>There are no favorite films yet.</h1>
        </>;
};
const FavoritesPage = (props) => connectWithState(props);

const mapStateToProps = (state) => {
    return {
        stateList: state.favorites
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteElement: index => dispatch(favoriteDeleted(index)),
        clearList: () => dispatch(favoritesCleaned()),
    };
};

export const Head = () => <title>Favorites</title>;

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesPage);
