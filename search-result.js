const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTQ3YzQxZWU5OTA0OTA0NDA4OTQ0YzI0YzE0MmFjMiIsIm5iZiI6MTcyODc1OTQ2OS4yNTgyNywic3ViIjoiNjcwNTc1NzUzMjJkM2VhODMxMWQ1ZmQ0Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.W9-_PxxFBzTIMrLInXStocvXoNRooLtjqqjaieG9b-E'
    }
};


let cardTemplate
let endIndex = 10; // Number of movies to display initially
let currentPage = 1; // Current page for pagination

document.addEventListener('DOMContentLoaded', async function () {
    cardTemplate = document.getElementById("movie-temp");

    const movies = await getDataNewQuery(getQueryParam("query"));
    console.log(movies);

    setUpMovies(movies);
});

async function setUpMovies(movies) {
    const container = document.getElementById('movies');

    
    console.log(movies);


    let forms = [];

    //ghost elements
    for (let i = 0; i < movies.length; i++) {
        container.appendChild(cardTemplate.content.cloneNode(true));
        forms.push(container.lastElementChild);
    }

    console.log(forms);


    //if there are not enough movies, get more
    /*
    if (movies.length < endIndex) {
        currentPage++;
        var t_movies = await getPopularMovies(currentPage);
        //console.log(t_movies);

        for (let i = 0; i < t_movies.results.length; i++) {
            movies.push(t_movies.results[i]);
        }
    }
*/

    for (let i = 0; i < forms.length; i++) {
        if (!movies[i]) console.log("Couldn't find movie at index " + i);
        let form = forms[i];

        let isMovie = movies[i].number_of_seasons === undefined;        

        let movie = movies[i];

        let title = form.querySelector("#title");
        let genre = form.querySelector("#genre");
        let runtime = form.querySelector("#runtime");

        //if(movie.imdb_id == null) return;

        console.log(form);

        form.href = `/watch${isMovie ? "" : "-serie"}.html?title=${isMovie ? movie.imdb_id : movie.external_ids.imdb_id + "&s=1&e=1"}`;

        title.innerHTML = isMovie ? movie.title : movie.name;


        form.querySelector("#poster").src = "https://image.tmdb.org/t/p/original/" + movie.poster_path;
        form.querySelector(".movie-poster").classList.remove("skeleton");
        form.querySelector(".description").classList.remove("skeleton");

        genre.innerHTML = movie.genres[0]?.name;

        runtime.innerHTML = isMovie ? movie.runtime : movie.episode_run_time[0] + " min";
    }
}


async function getDataNewQuery(movieName) {
    var url = "https://api.themoviedb.org/3/search/multi?query=" + movieName + "&include_adult=false&language=en-US&page=1";

    const response = await fetch(url, options)
        .then(response => response.json())
        .catch(err => console.error(err));

    return response;
}


function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}