import {graphql, navigate} from "gatsby";

const MoviesListsRedirects = ( {data}) => {
    navigate(`${data.allTmdbMovies.nodes[0].pathname}1/`);
};

export const query = graphql`
    query ($pathname: String) {
      allTmdbMovies(filter: {pathname: {eq: $pathname}}, limit: 1) {
        nodes {
          pathname
        }
      }
    }
`;

export default MoviesListsRedirects;