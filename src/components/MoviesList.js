import React from "react";
import {connect} from "react-redux";
import {Link} from "gatsby";
import CardComponent from "./Card";
import Nav from "react-bootstrap/Nav";
import PaginationComponent from "./Pagination";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {linkAdded} from "../redux/linksSlice";
import {favoriteAdded} from "../redux/favoritesSlice";
import {toWatchAdded} from "../redux/toWatchSlice";
import {movieAdded, movieDeleted} from "../redux/moviesSlice";
import {findInState} from "../state/initialState";

const MoviesList = (props) => {
    const {path, data, navLinks, subNavLinks, movies, addLink, deleteMovie, addFavorite, addToWatch, location} = props;
    addLink({title: navLinks[0].title, pathname: path});
    movies.forEach(movie => {
        if (movie.deleted) {
            deleteMovie(movie);
        }
    });
    const pathname = path.replace(/\d+\/$/g, "");
    const subNavLink = findInState(subNavLinks, {key: "pathname", value: pathname});
    const {pageHeader, pageTitle} = subNavLink;

    const nodes = data.allTmdbMovies.nodes;
    const {pageNumber} = nodes[0];
    const max = data.maxPage.max;
    const cols = 4;
    return (
        <>
            <title>{pageTitle}</title>
            <PaginationComponent pathname={pathname} activePage={pageNumber} max={max}/>
            <h1>{pageHeader}</h1>
            <Nav justify variant="tabs" activeKey={pathname}>
                {subNavLinks.map(({category, pathname}) => {
                    return (
                        <Nav.Item key={category}>
                            <Nav.Link eventKey={pathname} as={Link}
                                      to={`../..${pathname}1`}>
                                {category}
                            </Nav.Link>
                        </Nav.Item>
                    );
                })}
            </Nav>

            <Container>
                <Row className={`row-cols-lg-${cols} row-cols-2 gy-4`}>
                    {nodes.map((node, index) => {
                        // if (pathname === "/top-rated/") {
                        //     if (pageNumber === 1 || pageNumber === 2) {
                        //         addFavorite(node);
                        //         addToWatch(node);
                        //     }
                        // }
                        return (
                            <Col key={`${pathname}-${index}`}>
                                <CardComponent node={node}/>
                            </Col>
                        );
                    })}
                </Row>
            </Container>

            <PaginationComponent pathname={pathname} activePage={pageNumber} max={max}/>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        navLinks: state.links.navLinks,
        subNavLinks: state.links.subNavLinks,
        movies: state.movies
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addLink: action => dispatch(linkAdded(action)),
        addFavorite: action => dispatch(favoriteAdded(action)),
        addToWatch: action => dispatch(toWatchAdded(action)),
        deleteMovie: action => dispatch(movieDeleted(action))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoviesList);