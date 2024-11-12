var currentIndex = 1;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTQ3YzQxZWU5OTA0OTA0NDA4OTQ0YzI0YzE0MmFjMiIsIm5iZiI6MTcyODc1OTQ2OS4yNTgyNywic3ViIjoiNjcwNTc1NzUzMjJkM2VhODMxMWQ1ZmQ0Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.W9-_PxxFBzTIMrLInXStocvXoNRooLtjqqjaieG9b-E'
  }
};

document.addEventListener("DOMContentLoaded", async function () {

  const showID = (await getID(getQueryParam('title').split('/')[0]));
  var show = await getDataNew(showID);

  var seasonData = await getSeasonDataNew(showID, getQueryParam('s'));

  console.log(seasonData);
  

  document.title = "Watch " + show.name + " Online";

  var background = document.getElementById("background");
  var iframe = document.createElement("iframe");
  iframe.src = `https://multiembed.mov/?video_id=${getQueryParam('title')}&e=${getQueryParam('e')}&s=${getQueryParam('s')}`;
  iframe.allowFullscreen = true;
  background.appendChild(iframe);


  var divElement = document.createElement("div");
  var pElement = document.createElement("p");
  var textNode = document.createTextNode(show.name);
  pElement.appendChild(textNode);

  var spanElement = document.createElement("span");
  var spanTextNode = document.createTextNode("Season " + getQueryParam('s') + " Episode " + getQueryParam("e"));
  spanElement.appendChild(spanTextNode);

  pElement.appendChild(spanElement);
  divElement.appendChild(pElement);

  document.getElementById("serie-action").insertBefore(divElement, document.getElementById("serie-action").childNodes[2]);

  //Next/Previous button


  var information = document.getElementById("information");


  //Information
  information.innerHTML = `
    <div id="cover" style="background-image: url(https://image.tmdb.org/t/p/original/${show.poster_path});"></div>
      <div id="description">
        <h2>${show.name}</h2>
        <div id="Categories">
          <p id="Genre">Genre: Action</p>
          <p id="Duration">Duration: ${show.episode_run_time[0]} minutes</p>
          <p id="Country">Country: ${show.origin_country[0]}</p>
          <p id="Director">Director: ${show.created_by[0].name}</p>
        </div>
        <div id="rating">
          <p></p>
        </div>
        <div> ${show.overview}</div>
    </div>

  `


  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  // Episodes section
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  var episodesClassDiv = document.getElementById("episodes-class");
  episodesClassDiv.id = "episodes-class";

  var seasonsDiv = document.getElementById("seasons")

  var ulElement = document.getElementById("seasons-list");

  //Season click handler
  for (let index = 1; index <= show.number_of_seasons; index++) {
    var seasonLi = document.createElement("li");
    seasonLi.textContent = "Season " + index;

    seasonLi.addEventListener("click", async function () {
      // Remove the "active" class from the currently active season
      var activeSeason = document.querySelector("#seasons .active");
      if (activeSeason) {
        activeSeason.classList.remove("active");
      }

      // Add the "active" class to the clicked season
      ulElement.childNodes[index].classList.add("active");

      // Update the episodes based on the clicked season      
      updateEpisodes(await getSeasonDataNew(showID, index), show);

      currentIndex = index;
    });


    if (index == getQueryParam('s')) {
      seasonLi.className = "active";
    }

    ulElement.appendChild(seasonLi);
  }


  //Next and previous button
  for (let j = 0; j < 3; j++) {
    var btn = document.getElementById("serie-action").children[j];

    btn.addEventListener('click', function () {
      const title = show.external_ids.imdb_id;

      if (j === 2) {
        var newEp = parseInt(getQueryParam("e")) + 1;
        if (newEp >= seasonData.episodes.length + 1) {
          btn.classList = "inactive";
          return;
        }

        const url = `watch-serie.html?title=${encodeURIComponent(title)}&s=${getQueryParam('s')}&e=${newEp}`;
        window.location.href = url;
      }
      if (j === 0) {
        var newEp = parseInt(getQueryParam('e')) - 1;
        if (newEp < 1) {
          btn.classList = "inactive";
          return;
        }

        const url = `watch-serie.html?title=${encodeURIComponent(title)}&s=${getQueryParam('s')}&e=${(newEp)}`;
        window.location.href = url;
      }


    });
  }


  seasonsDiv.appendChild(ulElement);
  episodesClassDiv.appendChild(seasonsDiv);

  var episodesDiv = document.getElementById('episodes');

  updateEpisodes(seasonData, show)




  episodesClassDiv.appendChild(episodesDiv);

  document.getElementById("episodes-holder").appendChild(episodesClassDiv);
  //TODO: Change the api to TMDb for more detailed data and similar movies
  console.log(show);

});


async function getID(imdb_id) {
  const response = await fetch(`https://api.themoviedb.org/3/find/${imdb_id}?external_source=imdb_id`, options)
    .then(res => res.json())
    .catch(err => console.error(err));

  return response.tv_results[0].id;
}

async function getSimilarDataNew(movieID) {
  var url = "https://api.themoviedb.org/3/tv/" + movieID + "/similar?language=en-US&page=1";


  const response = await fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));

  return response;

}

function updateEpisodes(seasonData, showData) {
  document.getElementById("episodes")?.remove();

  var episodesDiv = document.createElement("div");
  episodesDiv.id = "episodes";

  for (let i = 0; i < seasonData.episodes.length; i++) {
    var episodeDiv = document.createElement("div");
    episodeDiv.className = "episode";

    var epNumberP = document.createElement("p");
    epNumberP.className = "ep-number";
    epNumberP.textContent = "Episode " + (i + 1);

    var epNameP = document.createElement("p");
    epNameP.className = "ep-name";
    epNameP.textContent = seasonData.episodes[i].name;

    episodeDiv.appendChild(epNumberP);
    episodeDiv.appendChild(epNameP);
    episodesDiv.appendChild(episodeDiv);

    episodeDiv.addEventListener("click", async function () {
      const title = showData.external_ids.imdb_id;

      const url = `watch-serie.html?title=${encodeURIComponent(title)}&s=${currentIndex}&e=${(i + 1)}`;
      console.log(url);

      window.location.href = url;
    });
  }

  document.getElementById("episodes-class").appendChild(episodesDiv);

  document.getElementById("episodes-holder").appendChild(document.getElementById("episodes-class"));
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


async function getDataNew(showID) {
  const response = await fetch(`https://api.themoviedb.org/3/tv/${showID}?append_to_response=external_ids&language=en-US`, options)
    .then(res => res.json())
    .catch(err => console.error(err));

  return response;
}

async function getSeasonDataNew(showID = "124364", season) {
  fetch(`https://api.themoviedb.org/3/tv/124364/${showID}/${season}?append_to_response=external_ids?language=en-US`, options)
    .then(res => res.json())
    .catch(err => console.error(err));
}


async function getSeasonData(movieID, seasonIndex) {
  const url = "https://www.omdbapi.com/?i=" + movieID + "&apikey=264ef6fe&Season=" + seasonIndex;
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

async function getSeasonDataNew(showID, seasonIndex) {
  const response = await fetch(`https://api.themoviedb.org/3/tv/${showID}/season/${seasonIndex}?language=en-US`, options)
    .then(res => res.json())
    .catch(err => console.error(err));

  return response;
}


async function setUpShows(shows) {
  const container = document.getElementById('similar');


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



function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.querySelector('.custom-select-trigger').addEventListener('click', function() {
  document.querySelector('.custom-options').classList.toggle('show');
});

document.querySelectorAll('.custom-option').forEach(option => {
  option.addEventListener('click', function() {
      // Remove the selected class from any previously selected option
      document.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));

      // Add the selected class to the clicked option
      this.classList.add('selected');

      // Update the select trigger text
      document.querySelector('.custom-select-trigger').textContent = this.textContent;

      // Hide the options
      document.querySelector('.custom-options').classList.remove('show');
  });
});



`
<div id="episodes-class">
  <div id="seasons">
    <ul>
      <li class="active">Season 1</li>
      <li>Season 2</li>
      <li>Season 3</li>
    </ul>
  </div>
<div id="episodes"><div class="episode"><p class="ep-number">Episode 1</p><p class="ep-name">Long Day's Journey Into Night</p></div><div class="episode"><p class="ep-number">Episode 2</p><p class="ep-name">The Way Things Are Now</p></div><div class="episode"><p class="ep-number">Episode 3</p><p class="ep-name">Choosing Day</p></div><div class="episode"><p class="ep-number">Episode 4</p><p class="ep-name">A Rock and a Farway</p></div><div class="episode"><p class="ep-number">Episode 5</p><p class="ep-name">Silhouettes</p></div><div class="episode"><p class="ep-number">Episode 6</p><p class="ep-name">Book 74</p></div><div class="episode"><p class="ep-number">Episode 7</p><p class="ep-name">All Good Things...</p></div><div class="episode"><p class="ep-number">Episode 8</p><p class="ep-name">Broken Windows, Open Doors</p></div><div class="episode"><p class="ep-number">Episode 9</p><p class="ep-name">Into the Woods</p></div><div class="episode"><p class="ep-number">Episode 10</p><p class="ep-name">Oh, the Places We'll Go</p></div></div></div>
`