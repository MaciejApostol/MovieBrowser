require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`
});
const fetch = require("node-fetch");
const path = require("path");
const {
    options, initialState,
    findInCredits, fetchData
} = require("./src/state/initialState");
const movies = initialState.subNavLinks;

exports.onCreateWebpackConfig = ({actions}) => {
    actions.setWebpackConfig({
        resolve: {
            fallback: {
                "path": require.resolve("path-browserify"),
                "crypto": require.resolve("crypto-browserify"),
                "os": require.resolve("os-browserify/browser"),
                "stream": require.resolve("stream-browserify")
            },
        },
    });
};

const tmdbMovies = [];
exports.sourceNodes = async ({actions, createContentDigest}) => {
    const {createNode} = actions;
    const url = "https://api.themoviedb.org/3/movie/";
    for (const moviesType of movies) {
        const {pathname} = moviesType;
        let moviesList, alternativeTitlesPl, movieEn;

        try {
            moviesList = await Promise.all(Array.from({length: moviesType.pages})
                .map(async (_, index) => {
                    const movies = await fetchData(url + `${moviesType.url}?language=pl-PL&page=${index + 1}`);
                    return movies.results;
                })
            );
            moviesList = moviesList.flat();
            console.log(moviesList[0]);
            alternativeTitlesPl = await Promise.all(moviesList.map(async (movie) => {
                return await fetchData(url + `${movie.id}/alternative_titles?country=PL`);
            }));
            movieEn = await Promise.all(moviesList.map(async (movie) => {
                return await fetchData(url + `${movie.id}?append_to_response=keywords%2Ccredits&language=en-US`);
            }));
        } catch (error) {
            console.warn(error);
            throw new Error(error);
        }


        const moviesOnPage = 20;
        let multiplier = 1;
        moviesList.forEach((movie, index) => {
            if (index === (moviesOnPage * multiplier)) {
                multiplier += 1;
            }
            const alternativeTitles = alternativeTitlesPl[index].titles;
            if (alternativeTitles.length) movie.title = alternativeTitles[0].title;

            const {keywords, credits} = movieEn[index];
            const {crew, cast} = credits;
            const directors = findInCredits(crew, "job", "Director");
            const actors = findInCredits(cast, "known_for_department", "Acting").slice(0, 3);

            const movieToCamelCase = {};
            Object.keys(movie).forEach(key => {
                if (!movie[key]) {
                    movie[key] = movieEn[key];
                }
                const replacement = key.replace(/^_(.)|_(.)|(.)_$/g,
                    (match, p1, p2, p3) => p1 ? p1.toUpperCase() : p2 ? p2.toUpperCase() :
                        p3.toUpperCase());
                return movieToCamelCase[replacement] = movie[key];
            });

            if (index === 1) {
                console.log(movieToCamelCase);
            }

            tmdbMovies.push({
                ...movieToCamelCase, pathname, pageNumber: multiplier, keywords: keywords.keywords, directors, actors
            });
        });
    }

    const moviesId = [];
    tmdbMovies.forEach((movie, index) => {
        let id = movie.id.toString();
        if (moviesId.includes(id)) id += `#${movies.map(({pathname}) => pathname).indexOf(movie.pathname)}`;
        moviesId.push(id);

        createNode({
            ...movie,
            id,
            internal: {
                type: "tmdbMovies",
                contentDigest: createContentDigest(movie)
            }
        });
    });
};

exports.createPages = async ({actions, graphql}) => {
    const {data} = await graphql(`
        query {
          allTmdbMovies {
            group(field: {pathname: SELECT}) {
              group(field: {pageNumber: SELECT}, limit: 1) {
                nodes {
                  pathname
                  pageNumber
                }
              }
            }
          }
        }
    `);

    const moviesPages = data.allTmdbMovies.group.map(group => group.group.map(({nodes}, index) => {
        let result;
        result = nodes[0];
        if (index === 0) {
            result = [{...nodes[0], pageNumber: 0}, nodes[0]];
        }
        return result;
    })).flat(2);
    moviesPages.forEach(({pathname, pageNumber}) => {
        actions.createPage({
            path: pageNumber === 0 ? pathname : `${pathname}${pageNumber}/`,
            component: path.resolve(pageNumber === 0 ? "./src/templates/movies-lists-redirects.js" :
                "./src/templates/movies-lists.js"),
            context: {pathname, pageNumber}
        });
    });

    // movies.forEach(({pathname}) => {
    // actions.createRedirect({
    //     fromPath: pathname,
    //     toPath: `${pathname}1/`,
    //     redirectInBrowser: true,
    // });
};

