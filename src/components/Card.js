import React, {useContext, useEffect} from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {StaticImage} from "gatsby-plugin-image";
import Container from "react-bootstrap/Container";
import {Link} from "gatsby";
import {movieAdded, movieCleaned, movieDeleted} from "../redux/moviesSlice";
import {connect} from "react-redux";
import {NavBarContext} from "./Layout";

const CardComponent = ({node, addMovie, deleteMovie, cleanMovies}) => {
    const movie = {...node};
    const {title, posterPath} = movie;
    let {id} = movie;
    id = id.replace(/#[0-9]*$/g, "");
    movie.id = id;
    const handleClick = (e) => {
        // e.preventDefault();
        // cleanMovies();
        addMovie(movie);
    };

    const handleDelete = () => {
        deleteMovie(movie);
    };

    return (
        <Card>
            <Card.Img src={`https://image.tmdb.org/t/p/w500${posterPath}`}/>
            <Card.Body>
                <Link to={`/movie/${id}`}></Link>
                <Card.Title><Link to={`/movie/${id}`} onClick={handleClick} onAuxClick={handleClick} state={movie}>
                    {title}</Link></Card.Title>
                <button onClick={handleDelete}>delete</button>
                {/*as={Link} to={`/movie/${id}`}*/}
                {/*<Card.Text>*/}
                {/*    This is a longer card with supporting text below as a natural*/}
                {/*    lead-in to additional content. This content is a little bit*/}
                {/*    longer.*/}
                {/*</Card.Text>*/}
            </Card.Body>
        </Card>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        addMovie: action => dispatch(movieAdded(action)),
        deleteMovie: action => dispatch(movieDeleted(action)),
        cleanMovies: () => dispatch(movieCleaned())
    };
};

export default connect(null, mapDispatchToProps)(CardComponent);