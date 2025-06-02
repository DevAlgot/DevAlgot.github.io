const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTQ3YzQxZWU5OTA0OTA0NDA4OTQ0YzI0YzE0MmFjMiIsIm5iZiI6MTcyODc1OTQ2OS4yNTgyNywic3ViIjoiNjcwNTc1NzUzMjJkM2VhODMxMWQ1ZmQ0Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.W9-_PxxFBzTIMrLInXStocvXoNRooLtjqqjaieG9b-E'
  }
};

function alertP(message) {
  alert(message);
}

document.addEventListener("DOMContentLoaded", async function () {

  var movie = await getDataNew(getQueryParam('title'));
  console.log(movie);


  document.title = "Watch " + movie.title + " Online";


  var background = document.getElementById("background");
  var t_iframe = document.createElement("iframe");
  //iframe.src = "https://www.NontonGo.win/embed/movie/"+movie.imdb_id;
  t_iframe.src = `https://multiembed.mov/?video_id=${movie.imdb_id}`; //directstream.php


  t_iframe.allowFullscreen = true;
  background.appendChild(t_iframe);

  let iframe = background.querySelector("iframe"); 
  background.innerHTML += `
      <div id="" style=" margin-top: -13px; padding-top: 13px; border-radius: 0 0 15px 15px; background: beige; height: 60px; "> 
        <div id="">Change Server
          <button id="server1">VidFast</button>
          <button id="server2">VidLink</button>
          <button id="server3">VidEasy</button>
          <button id="server4">MultiEmbed</button>
        </div>
      </div>

  `;
  background.querySelector("#server1").addEventListener("click", function () {  
     background.querySelector("iframe").src = `https://vidfast.pro/movie/${movie.imdb_id}`;
  });
   background.querySelector("#server2").addEventListener("click", function () {  
     background.querySelector("iframe").src = `https://vidlink.pro/movie/${movie.id}`;
  });
   background.querySelector("#server3").addEventListener("click", function () {  
     background.querySelector("iframe").src = `https://player.videasy.net/movie/${movie.id}?color=8B5CF6`;
  });
   background.querySelector("#server4").addEventListener("click", function () {  
     background.querySelector("iframe").src = `https://multiembed.mov/?video_id=${movie.imdb_id}`;
  });

  var informationHolder = document.getElementById("information-holder");


  let director = "Director: Unknown";

  for (let i = 0; i < movie.credits.crew.length; i++) {
    if (movie.credits.crew[i].job.includes("Director"))
      director = "Director: " + movie.credits.crew[i].name;
  }

  informationHolder.innerHTML += `
  <div id="information">¨
    <div id="cover" style="background-image: url(&quot;https://image.tmdb.org/t/p/original/${movie.poster_path};);"></div>
      <div id="description">
        <h2>${movie.title}</h2>
      <div id="Categories">
        <p id="Genre">Genre: ${movie.genres[0].name}</p>
        <p id="Duration">Duration: ${movie.runtime} minutes</p>
        <p id="Country">Country: ${movie.production_countries[0].name}</p>
        <p id="Director">${director}</p>
      </div>
        <div id="rating"><p></p></div>

      <div>${movie.overview}</div>
      </div>
    </div>
  `;

  setUpMovies(await getSimilarDataNew(movie.id));
  //setUpMovies(ar)


});

function change(url) {
  console.log("Changing iframe source to: " + url);
  
  iframe.src = url;
}

async function getData(movieID) {
  const url = "https://www.omdbapi.com/?i=" + movieID + "&apikey=264ef6fe";
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


async function getDataNew(movieID) {
  var url = "https://api.themoviedb.org/3/movie/" + movieID + "?append_to_response=credits";

  const response = await fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));

  return response;

}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function getFromIframe() {
  var iframe = document.querySelector('video');
  var video = iframe.contentWindow.document.getElementsByTagName('video')[0];
  console.log(video);
}

async function getSimilarDataNew(movieID, isMovie = true) {
  var url = "https://api.themoviedb.org/3/movie/" + movieID + "/recommendations?language=en-US&page=1";


  const response = await fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));

  return response;

}


async function setUpMovies(movies) {
  const container = document.getElementById('movies');

  movies.results.length = 12;

  movies.results.forEach(async p_movie => {
    const movie = await getDataNew(p_movie.id);
    console.log(movie);


    const form = document.createElement('a');

    form.href = `/watch.html?title=${movie.imdb_id}`;
    form.innerHTML += `
      
    <div class="movie">
      <div class="movie-poster"><img class="poster" src="https://image.tmdb.org/t/p/original/${movie.poster_path})" /></div>
      <div class="description">
        <p class="bold">${movie.title}</p>
        <div class="movie-description">
          <p>${movie.runtime} min</p>
          <p class="genre">${movie.genres[0]?.name}</p>
        </div>
      </div>
    </div>

    `
    container.appendChild(form);
  });
};
