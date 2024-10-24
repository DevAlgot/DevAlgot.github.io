const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTQ3YzQxZWU5OTA0OTA0NDA4OTQ0YzI0YzE0MmFjMiIsIm5iZiI6MTcyODc1OTQ2OS4yNTgyNywic3ViIjoiNjcwNTc1NzUzMjJkM2VhODMxMWQ1ZmQ0Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.W9-_PxxFBzTIMrLInXStocvXoNRooLtjqqjaieG9b-E'
    }
};



document.addEventListener('DOMContentLoaded', async function () {
    
    const movies = await getDataNewQuery(getQueryParam("query"));
    console.log(movies);

    setUpMovies(movies);
});

async function setUpMovies(movies) {
    const container = document.getElementById('movies');

    movies.map(async movie => {
        const form = document.createElement('form');

        form.id = movie.imdb_id;

        const button = document.createElement('button');
        button.type = 'submit';
        button.className = 'movie-button';

        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie';

        const posterDiv = document.createElement('img');
        posterDiv.className = 'poster';
        if (movie.poster_path == null) posterDiv.src = "Images/img-notfound.png";
        else posterDiv.src = `https://image.tmdb.org/t/p/original/${movie.poster_path})`;


        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'description';

        const titleP = document.createElement('p');
        titleP.className = 'bold';
        titleP.textContent = movie.title || movie.name;

        const movieDescriptionDiv = document.createElement('div');
        movieDescriptionDiv.className = 'movie-description';

        const durationP = document.createElement('p');
        durationP.textContent = (movie.runtime || movie.episode_run_time[0]) + " min";

        const genreP = document.createElement('p');
        genreP.className = 'genre';
        genreP.textContent = movie.genres[0].name;


        movieDescriptionDiv.appendChild(durationP);
        movieDescriptionDiv.appendChild(genreP);
        descriptionDiv.appendChild(titleP);
        descriptionDiv.appendChild(movieDescriptionDiv);
        movieDiv.appendChild(posterDiv);
        movieDiv.appendChild(descriptionDiv);
        button.appendChild(movieDiv);
        form.appendChild(button);
        container.appendChild(form);

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if(movie.external_ids == null){
                const title = movie.imdb_id;
                const url = `watch.html?title=${encodeURIComponent(title)}`;
                window.location.href = url;
            }
            else{
                const title = movie.external_ids.imdb_id;
                const url = `watch-serie.html?title=${encodeURIComponent(title)}&s=1&e=1`;
                window.location.href = url;
            }
        });

        return form;
    });

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