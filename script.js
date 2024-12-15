const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTQ3YzQxZWU5OTA0OTA0NDA4OTQ0YzI0YzE0MmFjMiIsIm5iZiI6MTcyODc1OTQ2OS4yNTgyNywic3ViIjoiNjcwNTc1NzUzMjJkM2VhODMxMWQ1ZmQ0Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.W9-_PxxFBzTIMrLInXStocvXoNRooLtjqqjaieG9b-E'
  }
};

var isOpen;

var startIndex = 12;
var endIndex = 24;

var currentPage = 1;

document.addEventListener('DOMContentLoaded', async () => {
  isOpen = false;

  var movieLinksPopular = [];
  var showLinksPopular = [];

  //setUpMovies(movieLinks);
  //setUpShows(showLinks);

  var popularMovies = await getPopularMovies();

  //Dropdown code here.
  document.getElementById("dropdown").addEventListener('click', function (event) {
    isOpen = !isOpen;

    if (!isOpen) {
      document.getElementById("dropdown-selector").remove();
    }
    else {
      document.querySelector("main").innerHTML += `
        <div id="dropdown-selector">
                <div id="input">
                    <input type="text" class="search" placeholder="Search Movie or TV-Series" onkeyup="search()">
                    <button onclick="searchClick()" type="button" class="search-button">Search</button>
                </div>  
                <ul>
                    <li><a href="">Home</a></li>
                    <li><a href="#movie-category">Movies</a></li>
                    <li><a href="">Coming</a></li>
                    <li><a href="">News</a></li>
                </ul>              
            </div>
        `
      document.querySelector(".header").classList.add("active-header", window.scrollY > 0);

    }
    //dropdown DOM and style here

  });




  for (let i = 0; i < 12; i++) {
    const popularMoviesFull = await (getDataNew(popularMovies.results[i].id));
    movieLinksPopular.push(popularMoviesFull.imdb_id);
  }

  for (let j = 0; j < 5; j++) {
    setUpSlider(popularMovies.results[j], movieLinksPopular[j]);
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

async function getPopularMovies(pageIndex = 1) {
  const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page='+pageIndex, options)
    .then(response => response.json())
    .catch(err => console.error(err));

  return response;
}


async function getTopRatedMovies() {
  const response = fetch('https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1', options)
    .then(response => response.json())
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


async function setUpSlider(movie, id) {
  const container = document.getElementById("omslag");
  console.log(id);


  const image = document.createElement("swiper-slide");
  image.classList = "movie1";
  image.style = "background-image: url(https://image.tmdb.org/t/p/original/" + movie.backdrop_path + ");"
  container.appendChild(image);
  image.innerHTML = `
  <div class="swiper-info">
    <h1 style="font-size: xxx-large; margin-bottom:1rem;">${movie.title}</h1>
    <a href="watch.html?title=${encodeURIComponent(id)}">${id ? "Watch now" : "Coming soon"}</a>
  </div>`

  //role="group" aria-label="1 / 2" class="swiper-slide-active"

}

async function setUpShows(shows) {
  const container = document.getElementById('series');


  var showPromises = shows.map(async show => {
    if (show.external_ids.imdb_id == null) return;
    if (container.childElementCount >= 12) return;
    //var movie = await getDataFromID(movie.external_ids.imdb_id);
    const form = document.createElement('form');

    form.id = show.imdbID;

    form.innerHTML += `
      <button type="submit" class="movie-button">
          <div class="movie">
            <img class="poster" src="https://image.tmdb.org/t/p/original/${show.poster_path})" />
            <div class="description">
              <p class="bold">${show.name}</p>
              <div class="movie-description">
                <p>${show.episode_run_time[0]} min</p>
                <p class="genre">${show.genres[0]?.name}</p>
              </div>
            </div>
          </div>
        </button>
    `

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const title = show.external_ids.imdb_id;
      const url = `watch-serie.html?title=${encodeURIComponent(title)}&s=1&e=1`;
      window.location.href = url;
    });

    container.appendChild(form);
    return form;
  });
}

async function setUpMovies(movies) {
  const container = document.getElementById('movies');

  const moviePromises = movies.map(async movie => {
    var movie = await getDataNew(movie);

    const form = document.createElement('form');

    form.id = movie.imdb_id;

    form.innerHTML += `
        <button type="submit" class="movie-button">
          <div class="movie">
            <img class="poster" src="https://image.tmdb.org/t/p/original/${movie.poster_path})" />
            <div class="description">
              <p class="bold">${movie.title}</p>
              <div class="movie-description">
                <p>${movie.runtime} min</p>
                <p class="genre">${movie.genres[0].name}</p>
              </div>
            </div>
          </div>
        </button>
 
    `

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


async function addMovies() {

  var movies = await getPopularMovies(currentPage);
  movies = movies.results;
  console.log(movies);
  
  if(movies.length < endIndex)
  {
    currentPage++;
    var t_movies = await getPopularMovies(currentPage);
    console.log(t_movies);
    
    for (let i = 0; i < t_movies.results.length; i++) {
      movies.push(t_movies.results[i]);       
    }
  }
  
  for (let i = startIndex; i < endIndex; i++) {
    const container = document.getElementById('movies');

    if(movies[i].id == null)  return;
    var movie = await getDataNew(movies[i].id);

    const form = document.createElement('form');

    form.id = movie.imdb_id;

    form.innerHTML += `
        <button type="submit" class="movie-button">
          <div class="movie">
            <img class="poster" src="https://image.tmdb.org/t/p/original/${movie.poster_path})" />
            <div class="description">
              <p class="bold">${movie.title}</p>
              <div class="movie-description">
                <p>${movie.runtime} min</p>
                <p class="genre">${movie.genres[0].name}</p>
              </div>
            </div>
          </div>
        </button>
    `

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const title = movie.imdb_id;
      const url = `watch.html?title=${encodeURIComponent(title)}`;
      window.location.href = url;
    });

    container.appendChild(form);
  }

  startIndex += 12;
  endIndex += 12;

}


window.addEventListener("scroll", function () {
  document.querySelector(".header").classList.toggle("active-header", window.scrollY > 0 || isOpen);
});


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