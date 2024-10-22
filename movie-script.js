const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTQ3YzQxZWU5OTA0OTA0NDA4OTQ0YzI0YzE0MmFjMiIsIm5iZiI6MTcyODc1OTQ2OS4yNTgyNywic3ViIjoiNjcwNTc1NzUzMjJkM2VhODMxMWQ1ZmQ0Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.W9-_PxxFBzTIMrLInXStocvXoNRooLtjqqjaieG9b-E'
  }
};


document.addEventListener("DOMContentLoaded", async function() {

    var movie = await getDataNew(getQueryParam('title'));

    document.title = "Watch " + movie.title + " Online";
    

    var background = document.getElementById("background");
    var iframe = document.createElement("iframe");
    
    iframe.src = `https://multiembed.mov/directstream.php?video_id=${movie.imdb_id}`; //directstream.php?
    
    
    iframe.allowFullscreen = true;
    background.appendChild(iframe);

    var informationHolder = document.getElementById("information-holder");
    var information = document.createElement("div");
    information.id = "information";

    var cover = document.createElement("div");
    cover.id = "cover";
    cover.style.backgroundImage = "url(https://image.tmdb.org/t/p/original/"+movie.poster_path+")";
    information.appendChild(cover);

    var description = document.createElement("div");
    description.id = "description";
    var title = document.createElement("h2");
    title.textContent = movie.title;
    description.appendChild(title);

    var categories = document.createElement("div");
    categories.id = "Categories";
    var genre = document.createElement("p");
    genre.id = "Genre";
    genre.textContent = "Genre: "+movie.genres[0].name;
    categories.appendChild(genre);
    var duration = document.createElement("p");
    duration.id = "Duration";
    duration.textContent = "Duration: "+ movie.runtime + " minutes";
    categories.appendChild(duration);
    var country = document.createElement("p");
    country.id = "Country";
    country.textContent = "Country: "+ movie.production_countries[0].name;
    categories.appendChild(country);
    var director = document.createElement("p");
    director.id = "Director";

    for (let i = 0; i < movie.credits.crew.length; i++) {
      if (movie.credits.crew[i].job.includes("Director")) 
        director.textContent = "Director: "+movie.credits.crew[i].name;      
    }
    //director.textContent = "Director: "+movie.credits.crew[1].name;
    categories.appendChild(director);
    description.appendChild(categories);

    var rating = document.createElement("div");
    rating.id = "rating";
    var ratingText = document.createElement("p");
    //ratingText.textContent = movie.Ratings[1];
    rating.appendChild(ratingText);
    description.appendChild(rating);

    var paragraph = document.createElement("div");
    var paragraphText = document.createTextNode(movie.overview);
    paragraph.appendChild(paragraphText);
    description.appendChild(paragraph);

    information.appendChild(description);
    informationHolder.appendChild(information);

});

async function getData(movieID) {
    const url = "https://www.omdbapi.com/?i="+movieID+"&apikey=264ef6fe";
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
  var url = "https://api.themoviedb.org/3/movie/"+movieID+"?append_to_response=credits";

  const response = await fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));

    return response;

}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);    
    return urlParams.get(param);
}

function getFromIframe(){
  var iframe = document.querySelector('iframe');
  var video = iframe.contentWindow.document.getElementsByTagName('iframe')[0];
  console.log(video);
  
}