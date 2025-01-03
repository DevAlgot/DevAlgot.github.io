const api_options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTQ3YzQxZWU5OTA0OTA0NDA4OTQ0YzI0YzE0MmFjMiIsIm5iZiI6MTcyODc1OTQ2OS4yNTgyNywic3ViIjoiNjcwNTc1NzUzMjJkM2VhODMxMWQ1ZmQ0Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.W9-_PxxFBzTIMrLInXStocvXoNRooLtjqqjaieG9b-E'
  }
};



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


function createSearchResult(data, index) {

  const resultDiv = document.createElement('div');
  resultDiv.className = 'result';

  const searchPosterDiv = document.createElement('div');
  searchPosterDiv.className = 'search-poster';

  const img = document.createElement('img');
  img.src = ("https://image.tmdb.org/t/p/original/" + data[index].poster_path) || "Images/image-not-found.png";
  img.alt = '';
  img.width = 342;
  img.height = 456;

  searchPosterDiv.appendChild(img);

  const searchTextDiv = document.createElement('div');
  searchTextDiv.className = 'search-text';

  const headerP = document.createElement('p');
  headerP.className = 'searchResult-header';
  headerP.textContent = data[index].name || data[index].title;

  const infoDiv = document.createElement('div');
  infoDiv.className = 'searchResult-info';

  const yearP = document.createElement('p');
  if (data[index].imdb_id == null) yearP.textContent = data[index].first_air_date?.split("-")[0];
  else yearP.textContent = data[index].release_date.split("-")[0];

  const durationP = document.createElement('p');
  durationP.textContent = (data[index].runtime || data[index].episode_run_time[0] || "0") + " min";

  const typeP = document.createElement('p');
  typeP.className = 'result-type';
  if (data[index].imdb_id == null) typeP.textContent = ("Tv-series ");
  else typeP.textContent = ("Movie");


  infoDiv.appendChild(yearP);
  infoDiv.appendChild(durationP);
  infoDiv.appendChild(typeP);

  searchTextDiv.appendChild(headerP);
  searchTextDiv.appendChild(infoDiv);

  resultDiv.appendChild(searchPosterDiv);
  resultDiv.appendChild(searchTextDiv);

  resultDiv.addEventListener('click', function (event) {
    event.preventDefault();
    if (data[index].imdb_id) {
      const title = data[index].imdb_id;
      const url = `watch.html?title=${encodeURIComponent(title)}`;
      window.location.href = url;
    }
    else {
      const title = data[index].external_ids.imdb_id;
      const url = `watch-serie.html?title=${encodeURIComponent(title)}&s=1&e=1`;
      window.location.href = url;
    }

  });


  return resultDiv;
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

