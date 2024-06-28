import React from "react";
import MoviesList from "../components/MoviesList";
import {graphql} from "gatsby";

const MoviesLists = ({data, path, location}) => {
    return (
        <>
            <MoviesList data={data} path={path} location={location}/>
        </>
    );
};

export const query = graphql`
    query MyQuery($pathname: String, $pageNumber: Int) {
      allTmdbMovies(
        filter: {pathname: {eq: $pathname}, pageNumber: {eq: $pageNumber}}
      ) {
        nodes {
          actors {
            id
            name
          }
          directors {
            id
            name
          }
          genreIds
          id
          title
          originalTitle
          overview
          posterPath
          pathname
          pageNumber
          releaseDate(formatString: "DD.MM.YYYY")
          keywords {
            id
          }
          voteAverage
          voteCount
        }
      }
      maxPage: allTmdbMovies(filter: {pathname: {eq: $pathname}}) {
        max(field: {pageNumber: SELECT})
      }
    }
`;
export default MoviesLists;