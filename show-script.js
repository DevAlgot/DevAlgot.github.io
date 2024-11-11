var currentIndex = 1;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTQ3YzQxZWU5OTA0OTA0NDA4OTQ0YzI0YzE0MmFjMiIsIm5iZiI6MTcyODc1OTQ2OS4yNTgyNywic3ViIjoiNjcwNTc1NzUzMjJkM2VhODMxMWQ1ZmQ0Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.W9-_PxxFBzTIMrLInXStocvXoNRooLtjqqjaieG9b-E'
  }
};

document.addEventListener("DOMContentLoaded", async function () {

  var show = await getData(getQueryParam('title').split('/')[0]);
  var seasonData = await getSeasonData(getQueryParam('title'), getQueryParam('s'));

  console.log(seasonData);


  document.title = "Watch " + show.Title + " Online";

  var background = document.getElementById("background");
  var iframe = document.createElement("iframe");
  iframe.src = `https://multiembed.mov/directstream.php?video_id=${getQueryParam('title')}&e=${getQueryParam('e')}&s=${getQueryParam('s')}`;
  iframe.allowFullscreen = true;
  background.appendChild(iframe);


  var divElement = document.createElement("div");
  var pElement = document.createElement("p");
  var textNode = document.createTextNode(show.Title);
  pElement.appendChild(textNode);

  var spanElement = document.createElement("span");
  var spanTextNode = document.createTextNode("Season " + getQueryParam('s') + " Episode " + getQueryParam("e"));
  spanElement.appendChild(spanTextNode);

  pElement.appendChild(spanElement);
  divElement.appendChild(pElement);

  document.getElementById("serie-action").insertBefore(divElement, document.getElementById("serie-action").childNodes[2]);

  //Next/Previous button


  var informationHolder = document.getElementById("information-holder");
  var information = document.createElement("div");
  information.id = "information";

  var cover = document.createElement("div");
  cover.id = "cover";
  cover.style.backgroundImage = "url(" + show.Poster + ")";
  information.appendChild(cover);

  var description = document.createElement("div");
  description.id = "description";
  var title = document.createElement("h2");
  title.textContent = show.Title;
  description.appendChild(title);

  var categories = document.createElement("div");
  categories.id = "Categories";
  var genre = document.createElement("p");
  genre.id = "Genre";
  genre.textContent = "Genre: Action";
  categories.appendChild(genre);
  var duration = document.createElement("p");
  duration.id = "Duration";
  duration.textContent = "Duration: " + show.Runtime;
  categories.appendChild(duration);
  var country = document.createElement("p");
  country.id = "Country";
  country.textContent = "Country: " + show.Country;
  categories.appendChild(country);
  var director = document.createElement("p");
  director.id = "Director";
  director.textContent = "Director: " + show.Director;
  categories.appendChild(director);
  description.appendChild(categories);

  var rating = document.createElement("div");
  rating.id = "rating";
  var ratingText = document.createElement("p");
  //ratingText.textContent = show.Ratings[1];
  rating.appendChild(ratingText);
  description.appendChild(rating);

  var paragraph = document.createElement("div");
  var paragraphText = document.createTextNode(show.Plot);
  paragraph.appendChild(paragraphText);
  description.appendChild(paragraph);

  information.appendChild(description);
  informationHolder.appendChild(information);


  var episodesClassDiv = document.createElement("div");
  episodesClassDiv.id = "episodes-class";

  var seasonsDiv = document.createElement("div");
  seasonsDiv.id = "seasons";

  var ulElement = document.createElement("ul");

  //Season click handler
  for (let index = 1; index <= show.totalSeasons; index++) {
    var seasonLi = document.createElement("li");
    seasonLi.textContent = "Season " + index;

    seasonLi.addEventListener("click", async function () {
      // Remove the "active" class from the currently active season
      var activeSeason = document.querySelector("#seasons .active");
      if (activeSeason) {
        activeSeason.classList.remove("active");
      }

      // Add the "active" class to the clicked season
      ulElement.childNodes[index - 1].classList.add("active");

      // Update the episodes based on the clicked season
      updateEpisodes(await getSeasonData(getQueryParam('title').split('/')[0], index), show);
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
      console.log("Clicked button " + j);

      const title = show.imdbID;

      if (j === 2) {
        var newEp = parseInt(getQueryParam("e")) + 1;
        if (newEp >= seasonData.Episodes.length + 1) {
          btn.classList = "inactive";
          return;
        }

        const url = `watch-serie.html?title=${encodeURIComponent(title)}&s=${getQueryParam('s')}&e=${newEp}`;
        console.log(url);
        window.location.href = url;
      }
      if (j === 0) {
        var newEp = parseInt(getQueryParam('e')) - 1;
        if (newEp < 1) {
          btn.classList = "inactive";
          return;
        }

        const url = `watch-serie.html?title=${encodeURIComponent(title)}&s=${getQueryParam('s')}&e=${(newEp)}`;
        console.log(url);
        window.location.href = url;
      }


    });
  }


  seasonsDiv.appendChild(ulElement);
  episodesClassDiv.appendChild(seasonsDiv);

  var episodesDiv = document.createElement("div");
  episodesDiv.id = "episodes";


  for (let i = 0; i < seasonData.Episodes.length; i++) {
    var episodeDiv = document.createElement("div");
    episodeDiv.className = "episode";

    var epNumberP = document.createElement("p");
    epNumberP.className = "ep-number";
    epNumberP.textContent = "Episode " + (i + 1);

    var epNameP = document.createElement("p");
    epNameP.className = "ep-name";
    epNameP.textContent = seasonData.Episodes[i].Title;

    episodeDiv.appendChild(epNumberP);
    episodeDiv.appendChild(epNameP);
    episodesDiv.appendChild(episodeDiv);

    episodeDiv.addEventListener("click", async function () {
      const title = show.imdbID;

      const url = `watch-serie.html?title=${encodeURIComponent(title)}&s=${currentIndex}&e=${i + 1}`;
      console.log(url);

      window.location.href = url;
    });
  }

  episodesClassDiv.appendChild(episodesDiv);

  document.getElementById("episodes-holder").appendChild(episodesClassDiv);

  console.log(show);

  console.log(await getSimilarDataNew(seasonData.id));

  //TODO: Change the api to TMDb for more detailed data and similar movies


});


async function getSimilarDataNew(movieID) {
  var url = "https://api.themoviedb.org/3/tv/" + movieID + "/similar?language=en-US&page=1";


  const response = await fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));

  return response;

}

function updateEpisodes(seasonData, showData) {
  document.getElementById("episodes").remove();

  var episodesDiv = document.createElement("div");
  episodesDiv.id = "episodes";

  for (let i = 0; i < seasonData.Episodes.length; i++) {
    var episodeDiv = document.createElement("div");
    episodeDiv.className = "episode";

    var epNumberP = document.createElement("p");
    epNumberP.className = "ep-number";
    epNumberP.textContent = "Episode " + (i + 1);

    var epNameP = document.createElement("p");
    epNameP.className = "ep-name";
    epNameP.textContent = seasonData.Episodes[i].Title;

    episodeDiv.appendChild(epNumberP);
    episodeDiv.appendChild(epNameP);
    episodesDiv.appendChild(episodeDiv);

    episodeDiv.addEventListener("click", async function () {
      const title = showData.imdbID;

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