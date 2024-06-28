import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import Button from "react-bootstrap/Button";
import {favoriteAdded} from "../../redux/favoritesSlice";
import {toWatchAdded} from "../../redux/toWatchSlice";
import {NavBarContext} from "../../components/Layout";
import {movieAdded, movieCleaned, movieSoftDeleted} from "../../redux/moviesSlice";
import {fetchData, findInCredits, options} from "../../state/initialState";

const Movie = (props) => {
    const {id, path, movies, navLinks, uri, addFavorite, addToWatch, deleteMovie, cleanMovies, location} = props;
    const [fetchedMovies, setFetchedMovies] = useState([]);
    const movie = movies.find(movie => movie.id === id);
    const {setNavBarData} = useContext(NavBarContext);
    window.addEventListener("beforeunload", (e) => {
        deleteMovie(movie);
    });

    const {actors, directors, keywords} = movie;
    let {genreIds} = movie;

    const getIds = (group1, separator = "%7C", group2 = []) => {
        return [...new Set([group1, group2].flat().map(({id}) => id))].join(separator);
    };

    genreIds = genreIds.join("%7C");
    const keywordsIds = getIds(keywords);
    const peopleIds = getIds(actors, directors);

    console.log(movie.genreIds.join("|"));
    console.log(getIds(keywords, "|"));
    console.log(getIds(actors, "|", directors));

    useEffect(() => {
        setNavBarData({brand: movie.title, activeKey: navLinks[0].title});

        try {
            (async () => {
                const withGenres = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=pl-PL&page=1&sort_by=vote_count.desc&with_genres=${genreIds}`;
                const withKeywords = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=pl-PL&page=1&sort_by=vote_count.desc&with_keywords=${keywordsIds}`;
                const withPeople = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=pl-PL&page=1&sort_by=vote_count.desc&with_people=${peopleIds}`;
                const results = (await Promise.all([withKeywords, withGenres]
                    .map(async (url, index) => {
                        const movies = await fetchData(url);
                        return movies.results;
                    })
                )).flat();
                const movieEn = await Promise.all(results.map(async (movie) => {
                    return await fetchData(`https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=keywords%2Ccredits&language=en-US`);
                }));

                const newResults = results.map((resultMovie, index) => {
                    const {keywords, credits} = movieEn[index];
                    const {crew, cast} = credits;
                    const directors = findInCredits(crew, "job", "Director");
                    const actors = findInCredits(cast, "known_for_department", "Acting").slice(0, 3);
                    return {...resultMovie, keywords: keywords.keywords, directors, actors};
                }).filter(resultMovie => resultMovie.id.toString() !== movie.id);

                const unique = [];
                newResults.forEach(result => {
                    const find = unique.find(({id}) => id === result.id);
                    if (!unique.includes(find)) {
                        unique.push(result);
                    }
                });

                const initialValue = 0;
                const sumWithInitial = unique.reduce(
                    (accumulator, currentValue) => accumulator + currentValue.vote_average, 0,);
                const mean = sumWithInitial / unique.length;

                unique.forEach((newMovie, index) => {
                    newMovie.similarities = 0;
                    const similarities = [];
                    movie.actors.forEach(actor => {
                        if (newMovie.actors.some(({id}) => id === actor.id)) {
                            similarities.push(actor.name);
                        }
                    });
                    movie.directors.forEach(director => {
                        if (newMovie.directors.some(({id}) => id === director.id)) {
                            similarities.push(director.name);
                        }
                    });
                    movie.keywords.forEach(({id: keywordId}) => {
                        newMovie.keywords.forEach(({id, name}) => {
                            if (id === keywordId) {
                                similarities.push(name);
                            }
                        });
                    });
                    movie.genreIds.forEach(genreId => {
                        if (newMovie.directors.some(({id}) => id === genreId)) {
                            similarities.push(genreId);
                        }
                    });
                    movie.similarities = similarities.length;
                    if (similarities.length > 0) {
                        console.log(newMovie.title, newMovie.id, movie.similarities,similarities.join(", "));
                    }

                });
                unique.sort((a, b) => a.similarities > b.similarities ? -1 : a.similarities === b.similarities ? a.vote_count > b.vote_count ? -1 : 1 : 1);
                // unique.forEach(movie => console.log(movie.title, movie.similarities, movie.vote_count,
                    // movie.directors[0],
                    // movie.actors.map(({id, name})=> {
                    //     return `id:${id}, name:${name}`;
                    // }).join(", ")
                // ));
            })();


        } catch (error) {
            throw new Error(error);
        }


        return () => deleteMovie(movie);
    }, []);

    const handleAddFavorite = () => {
        addFavorite(movie);
    };

    const handleAddToWatch = () => {
        addToWatch(movie);
    };


    const recommendedMovies = [];

    return (
        <>
            {Object.keys(movie).map((key, index) => {
                const value = movie[key];
                let result = value;

                if (typeof value === "object" && value !== null) {
                    result = Object.keys(value).map(key => `${key}: ${value[key]}`).join(", ");
                }

                if (Array.isArray(value)) {
                    result = value.map(val => Object.keys(val).map(key => `${key}: ${val[key]}`).join(", ")).join(", ");
                }

                return (
                    <div key={`key-${index}`}>{key}:
                        <p>{result}
                        </p>
                    </div>
                );
            })}
            <br/>
            <Button onClick={handleAddFavorite}>Do ulubionych</Button>
            <Button onClick={handleAddToWatch}>Do obejrzenia</Button>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        movies: state.movies,
        navLinks: state.links.navLinks,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addFavorite: (movie) => dispatch(favoriteAdded(movie)),
        addToWatch: (movie) => dispatch(toWatchAdded(movie)),
        deleteMovie: action => dispatch(movieSoftDeleted(action)),
        addMovie: movie => dispatch(movieAdded(movie)),
        cleanMovies: () => dispatch(movieCleaned())
    };
};

export const Head = () => <title>Movie</title>;

export default connect(mapStateToProps, mapDispatchToProps)(Movie);