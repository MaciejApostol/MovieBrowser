const findInState = (array, {key, value}) => {
    return array.find(element => {
        element = element[key] === undefined ? element : element[key];
        return Array.isArray(element) ? findInState(element, {key, value}) : element === value;
    });
};

const subNavLinks = [
    {url: "top_rated", category: "Ranking", pages: 12, pageHeader: "Najlepiej oceniane filmy"},
    {url: "popular", category: "Popularne", pages: 4, pageHeader: "Zobacz co jest teraz na czasie"},
    {url: "now_playing", category: "Teraz w kinach", pages: 4, pageHeader: "Sprawdź co jest teraz w kinach"},
    {url: "upcoming", category: "Nadchodzące", pages: 4, pageHeader: "Nadchodzące premiery"}
];
subNavLinks.forEach(link => {
    link.pathname = `/${link.url.replaceAll("_", "-")}/`;
    link.pageTitle = link.url.replace(/^_*(.)|_+(.)|(.)_+$/g,
        (match, p1, p2, p3) => p1 ? p1.toUpperCase() : p2 ? " " + p2.toUpperCase() : p3.toLowerCase());
});

const navLinks = [
    {
        pathname: [subNavLinks[0].pathname],
        title: "Wyszukiwarka"
    },
    {
        pathname: ["/favorites/1/", "/favorites/:page"],
        title: "Ulubione"
    },
    {
        pathname: ["/to-watch/1/", "/to-watch/:page"],
        title: "Do obejrzenia"
    }
];

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`
    }
};

const fetchData = async (url) => {
    const response = await fetch(url, options);
    return await response.json();
};

const findInCredits = (group, key, department) => {
    return group.filter(person => person[key] === department).map(({id, name}) => {
        return {id, name};
    });
};

module.exports = {initialState: {navLinks, subNavLinks}, findInState, findInCredits, fetchData, options};