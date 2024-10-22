const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTQ3YzQxZWU5OTA0OTA0NDA4OTQ0YzI0YzE0MmFjMiIsIm5iZiI6MTcyODc1OTQ2OS4yNTgyNywic3ViIjoiNjcwNTc1NzUzMjJkM2VhODMxMWQ1ZmQ0Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.W9-_PxxFBzTIMrLInXStocvXoNRooLtjqqjaieG9b-E'
  }
};


document.addEventListener('DOMContentLoaded', async () => {

  var movieLinksPopular = [];
  var showLinksPopular = [];

  const showLinks = [
    "tt0944947",
    "tt2861424",
    "tt0386676",
    "tt0773262",
    "tt4816058",
    "tt0903747"
  ];



  //setUpMovies(movieLinks);
  //setUpShows(showLinks);

  var popularMovies = await getPopularMoives();
  for (let i = 0; i < 12; i++) {
    const popularMoviesFull = await (getDataNew(popularMovies.results[i].id));
    movieLinksPopular.push(popularMoviesFull.imdb_id);
  }
  setUpMovies(movieLinksPopular);

  var popularShows = await getPopularShows();
  for (let i = 0; i < 20; i++) {
    const popularShowsFull = await (getDataNew(popularShows.results[i].id, false));
    showLinksPopular.push(popularShowsFull);

  }
  setUpShows(showLinksPopular);
});


async function getDataNew(movieID, isMovie = true) {
  var url = "";
  if (isMovie) url = "https://api.themoviedb.org/3/movie/" + movieID + "?language=en-US";
  else url = "https://api.themoviedb.org/3/tv/" + movieID + "?append_to_response=external_ids&language=en-US";

  const response = await fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));

  return response;

}

async function getPopularShows() {
  const response = await fetch('https://api.themoviedb.org/3/discover/tv?include_adult=true&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_original_language=en', options)
    .then(response => response.json())
    .catch(err => console.error(err));

  return response;
}

async function getPopularMoives() {
  const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
    .then(response => response.json())
    .catch(err => console.error(err));

  return response;
}


async function getTopRatedMovies() {
  const response = fetch('https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

  return response;
}


async function getData(movieID, type = "") {
  var url;

  if (type === 'name') {
    url = "https://www.omdbapi.com/?s=" + movieID + "&apikey=264ef6fe&page=1-2";
  }
  else {
    url = "https://www.omdbapi.com/?i=" + movieID + "&apikey=264ef6fe";
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

async function getDataNewQuery(movieName) {
  var url = "https://api.themoviedb.org/3/search/multi?query=" + movieName + "&include_adult=false&language=en-US&page=1";

  const response = await fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));

  var results = [];

  for (let i = 0; i < Math.min(response.results.length, 10); i++) {
    results.push(await getDataFromID(response.results[i].id, response.results[i].media_type));
    //console.log(response.results[i]);      
  }
  //sconsole.log(results);

  return results;
}

async function getDataFromID(id, movie) {
  var url
  if (movie === 'movie') {
    url = "https://api.themoviedb.org/3/movie/" + id + "&include_adult=false&language=en-US&append_to_response=external_ids";
  }
  else {
    url = "https://api.themoviedb.org/3/tv/" + id + "?append_to_response=external_ids";
  }

  const response = await fetch(url, options)
    .then(response => response.json())
    //.then(response => console.log(response))
    .catch(err => console.error(err));

  return response;
}


async function setUpShows(shows) {
  const container = document.getElementById('series');


  shows.map(async movie => {
    if (movie.external_ids.imdb_id == null) return;
    if (container.childElementCount >= 12) return;
    //var movie = await getDataFromID(movie.external_ids.imdb_id);
    const form = document.createElement('form');

    form.id = movie.imdbID;

    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'movie-button';

    const movieDiv = document.createElement('div');
    movieDiv.className = 'movie';

    const posterDiv = document.createElement('img');
    posterDiv.className = 'poster';
    posterDiv.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;

    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'description';

    const titleP = document.createElement('p');
    titleP.className = 'bold';
    titleP.textContent = movie.name;

    const movieDescriptionDiv = document.createElement('div');
    movieDescriptionDiv.className = 'movie-description';

    const durationP = document.createElement('p');
    durationP.textContent = (movie.episode_run_time[0] || "0") + " min";

    const genreP = document.createElement('p');
    genreP.className = 'genre';
    genreP.textContent = movie.genres[0]?.name;

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
      const title = movie.external_ids.imdb_id;
      const url = `watch-serie.html?title=${encodeURIComponent(title)}&s=1&e=1`;
      window.location.href = url;
    });

    return form;
  });

  //forms.forEach(form => container.appendChild(form));
}

async function setUpMovies(movies) {
  const container = document.getElementById('movies');

  const moviePromises = movies.map(async movie => {
    var movie = await getDataNew(movie);

    const form = document.createElement('form');

    form.id = movie.imdb_id;

    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'movie-button';

    const movieDiv = document.createElement('div');
    movieDiv.className = 'movie';

    const posterDiv = document.createElement('img');
    posterDiv.className = 'poster';
    posterDiv.src = `https://image.tmdb.org/t/p/original/${movie.poster_path})`;


    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'description';

    const titleP = document.createElement('p');
    titleP.className = 'bold';
    titleP.textContent = movie.title;

    const movieDescriptionDiv = document.createElement('div');
    movieDescriptionDiv.className = 'movie-description';

    const durationP = document.createElement('p');
    durationP.textContent = movie.runtime + " min";

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
      const title = movie.imdb_id;
      const url = `watch.html?title=${encodeURIComponent(title)}`;
      window.location.href = url;
    });

    return form;
  });
  var forms = await Promise.all(moviePromises);
  forms.forEach(form => container.appendChild(form));
}

window.addEventListener("scroll", function () {
  document.querySelector(".header").classList.toggle("active-header", window.scrollY > 0);
});





document.addEventListener('DOMContentLoaded', async () => {

  const movieLinks = [
    "tt0068646", // Element 0, ID = tt0068646 i = 0
    "tt0468569", // 1 i = 1
    "tt0463234", // 2 ...
    
  ];


  for (let i = 0; i < movieLinks.length; i++) {
    var movie = await getMovieData(movieLinks[i]);
    console.log(movie.title);
    
  }


});

async function getMovieData(movieID) {
  const url = "https://api.themoviedb.org/3/movie/"+movieID+"?language=en-US";

  return await fetch(url, options)
    .then(res => res.json())
    .catch(err => console.error(err));

}



/*
<form id="tt000000">
                <button type="submit" class="movie-button">
                  <div class="movie">
                    <img class="poster" src="Images/shrekPoster.jpg" />
                    <div class="description">
                      <p class="bold">Shrek</p>
                      <div class="movie-description">
                        <p>75 min</p>
                        <p class="genre">Action</p>
                      </div>
                    </div>
                  </div>
                </button>
              </form>
*/