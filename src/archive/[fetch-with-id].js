import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import ProgressBar from "react-bootstrap/ProgressBar";
import {favoriteAdded} from "../redux/favoritesSlice";
import {NavBarContext} from "../components/Layout";
import {toWatchAdded} from "../redux/toWatchSlice";


const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`
    },
    // signal: AbortSignal.timeout(3000)
};

const Movie = (props) => {
    const {id, navLinks, addFavorite, addToWatch} = props;
    console.log(props);
    const [movie, setMovie] = useState();
    const [now, setNow] = useState(10);
    const {setNavBarData} = useContext(NavBarContext);

    const handleAddFavorite = () => {
        addFavorite(movie);
    };

    const handleAddToWatch = () => {
        addToWatch(movie);
    };

    const reduceMovieData = (movie) => {
        const {
            id, budget, original_title, keywords, overview, release_date: releaseDate, genres, title,
            vote_average: voteAverage, vote_count: voteCount, credits
        } = movie;
        const {crew, cast} = credits;

        // const generateList = (peopleList, key) => {
        //     let results = [];
        //     peopleList.forEach(member => {
        //         const {name} = member;
        //         const category = member[key];
        //         const memberData = {
        //             category,
        //             names: [name]
        //         };
        //         const index = results.map(person => person.category).indexOf(category);
        //         if (index === -1) {
        //             results.push(memberData);
        //         } else {
        //             results[index].names.push(name);
        //         }
        //     });
        //     return results.sort((a, b) => a.category > b.category ? 1 : -1);
        // };
        //
        // const test = generateList(cast, "known_for_department");
        // test.forEach(({category, names}) => console.log(category, ":", names));

        const findInCredits = (department, key = "job", group = crew) => {
            return group.filter(person => person[key] === department).map(({id, name}) => {
                return {id, name};
            });
        };
        const directors = findInCredits("Director");
        const producers = findInCredits("Producer");
        const screenplay = findInCredits("Screenplay");
        const actors = findInCredits("Acting", "known_for_department", cast).slice(0, 3);
        const genreIds = genres.map(({id}) => id);
        const peopleIds = [...new Set([directors, actors].flat().map(({id}) => id))];

        const results = {
            actors, id, budget, directors, genres, genreIds, original_title, overview, peopleIds, producers,
            release_date: releaseDate, screenplay, title, vote_average: voteAverage, vote_count: voteCount
        };
        return results;
    };

    useEffect(() => {
        setNavBarData({brand: <Spinner animation="border" variant="light"/>, activeKey: navLinks[0].title});
        let movie = "";
        let movieEn = "";
        (async () => {
            setNow(100);

            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?append_to_response=keywords%2Ccredits&language=pl-PL`,
                    options);
                const responseEn = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`,
                    options);
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                movie = await response.json();
                movieEn = await responseEn.json();
            } catch (error) {
                throw Error(error);
            }
            movie = reduceMovieData(movie);
            Object.keys(movie).forEach(key => {
                if (!movie[key]) {
                    console.log(movie.title);
                    movie[key] = movieEn[key];
                }
            });
            setMovie(movie);
            setNavBarData({brand: movie.title, activeKey: navLinks[0].title});
        })();
    }, []);

    // const fetchPerson = async (peopleList) => {
    //     try {
    //         const responses = await Promise.all([
    //             ...peopleList.map(person =>
    //                 fetch(`https://api.themoviedb.org/3/person/${person.id}/movie_credits?language=en-US`,
    //                     options)),
    //         ]);
    //         return await Promise.all(responses.map(response => response.json()));
    //     } catch (error) {
    //         throw Error(error);
    //     }
    // };
    //
    // const fetchPersonMovies = async () => {
    //     try {
    //
    //     } catch (error) {
    //         throw Error(error);
    //     }
    // };

    // useEffect(() => {
    //     if (movie) {
    //         (async () => {
    //             const {actors, directors, genreIds} = movie;
    //             let directorsResponse;
    //             let actorsResponse;
    //             try {
    //                 directorsResponse = await fetchPerson(directors);
    //                 actorsResponse = await fetchPerson(actors);
    //             } catch (error) {
    //                 throw Error(error);
    //             }
    //             let peopleList = [];
    //             directorsResponse.forEach(director =>
    //                 peopleList = [...director.crew.filter(({job}) => job === "Director").slice(0, 20)]);
    //
    //             actorsResponse.forEach((actor, mainIndex) => {
    //                 let count = 0;
    //                 actor.cast.some((movie) => {
    //                     if (!peopleList.find(({id}) => id === movie.id)) {
    //                         peopleList.push(movie);
    //                         count += 1;
    //                     }
    //                     return count === 20;
    //                 });
    //
    //             });
    //
    //             peopleList.forEach(movie => {
    //                 let genreSimilarities = 0;
    //                 movie.genre_ids.forEach(id => {
    //                     if (genreIds.includes(id)) {
    //                         genreSimilarities += 1;
    //                     }
    //                 });
    //                 movie.genre_similarities = genreSimilarities;
    //             });
    //             console.log(movie.genreIds);
    //
    //             peopleList.sort((a, b) => (a.vote_count > b.vote_count ? -1 :
    //                 (a.vote_count === b.vote_count ? (a.genre_similarities > b.genre_similarities ? -1 : 1) : 1)));
    //             peopleList.slice(0, 20).forEach(movie => console.log(movie.title, movie.vote_count, movie.genre_similarities));
    //             // console.log(peopleList.slice(0,3));
    //         })();
    //     }
    // }, [movie]);

    if (movie) {
        return (
            <>
                {Object.keys(movie).map(key => {
                    const value = movie[key];
                    let result = value;

                    if (typeof value === "object" && value !== null) {
                        result = Object.keys(value).map(key => `${key}: ${value[key]}`).join(", ");
                    }

                    if (Array.isArray(value)) {
                        result = value.map(val => Object.keys(val).map(key => `${key}: ${val[key]}`).join(", ")).join(", ");
                    }

                    return (
                        <div>{key}:
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
    }
    return (
        <>
            <div className={"d-flex align-items-center vh-25"}>
                <ProgressBar now={now} label={`${now}%`} visuallyHidden className={"w-100"}/>
            </div>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        navLinks: state.links.navLinks,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addFavorite: (movie) => dispatch(favoriteAdded(movie)),
        addToWatch: (movie) => dispatch(toWatchAdded(movie))
    };
};

export const Head = () => <title>Movie</title>;

export default connect(mapStateToProps, mapDispatchToProps)(Movie);