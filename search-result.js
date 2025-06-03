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

  setUpMovies(movies);
});

async function setUpMovies(movies_results) {
  const container = document.getElementById('movies');

  let forms = [];

  //ghost elements
  for (let i = 0; i < movies_results.results.length; i++) {
    container.appendChild(cardTemplate.content.cloneNode(true));
    forms.push(container.lastElementChild);
  }

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

  for (let i = 0; i < movies_results.results.length; i++) {
    
    if (movies_results.results[i] === null|| movies_results.results[i].media_type == "person" || movies_results.results[i].id == null) {
      console.log("Couldn't find movie at index " + i);
      forms[i].remove();
      continue;
    }


    let movie = await getDataFromID(movies_results.results[i].id, movies_results.results[i])
    console.log(movie);
    if (movie === null) {
      console.log("Couldn't find movie at index " + i);
      forms[i].remove();
      continue;
    }

    let form = forms[i];

    let isMovie = movie?.number_of_seasons === undefined;


    let title = form.querySelector("#title");
    let genre = form.querySelector("#genre");
    let runtime = form.querySelector("#runtime");

    //if(movie.imdb_id == null) return;

    form.href = `/watch${isMovie ? "" : "-serie"}.html?title=${isMovie ? movie.imdb_id : movie.external_ids.imdb_id + "&s=1&e=1"}`;

    title.innerHTML = isMovie ? movie.title : movie.name;


    form.querySelector("#poster").src = movie.poster_path != null ? "https://image.tmdb.org/t/p/original/" + movie.poster_path : "Images/image-not-found.png";
    form.querySelector("#poster").classList.add("no-poster");
    form.querySelector(".movie-poster").classList.remove("skeleton");
    form.querySelector(".description").classList.remove("skeleton");

    genre.innerHTML = movie.genres.length > 0 ? movie.genres[0]?.name : "";

    runtime.innerHTML = isMovie ? movie.runtime + " min" : movie.episode_run_time[0] + " min";
  }
  currentPage++;
}


async function search() {
  console.log("Searching...");

  const input = document.getElementsByClassName('search')[0];

  input.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
      console.log("Enter key pressed");
      const title = input.value;
      const url = `search.html?query=${encodeURIComponent(title)}`;
      window.location.href = url;
    }
  });
}
async function searchClick() {

  const input = document.getElementsByClassName('search')[isOpen ? 1 : 0];
  //input.value = "Hello World";

  const title = input.value;
  console.log(title);

  const url = `search.html?query=${encodeURIComponent(title)}`;
  window.location.href = url;
}


async function getDataNewQuery(movieName) {
  var url = "https://api.themoviedb.org/3/search/multi?query=" + movieName + "&include_adult=false&language=en-US&page=" + currentPage;

  const response = await fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));

  return response;
}

async function getDataFromID(id, movie) {
  var url
  if (movie.media_type === "movie") {
    url = "https://api.themoviedb.org/3/movie/" + id + "&include_adult=false&language=en-US&append_to_response=external_ids";
  }
  else if (movie.media_type === "tv") {
    url = "https://api.themoviedb.org/3/tv/" + id + "?append_to_response=external_ids";
  }
  else {
    return null;
  }

  const response = await fetch(url, options)
    .then(response => response.json())
    //.then(response => console.log(response))
    .catch(err => console.error(err));

  return response;
}

async function moreMovies() {
  console.log("Loading more movies...");

  const movies = await getDataNewQuery(getQueryParam("query"));

  if (movies.results.length === 0) {
    console.log("No more movies found.");
    document.getElementById('more').setAttribute('disabled', 'true');
    document.getElementById('more').style.cursor = 'not-allowed';
    document.getElementById('more').innerHTML = 'No more movies found';
    return;
  }

  setUpMovies(movies);
}

/*
async function getDataNewQuery(movieName) {
    var url = "https://api.themoviedb.org/3/search/multi?query=" + movieName + "&include_adult=true&language=en-US&page=1";

    const response = await fetch(url, options)
        .then(response => response.json())
        .catch(err => console.error(err));

    return response;
}
*/

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}