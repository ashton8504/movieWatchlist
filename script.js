const APIKEY = '5e713387';
console.log(APIKEY);

const headerContainer = document.querySelector('.header-container');
const watchlistLink = document.querySelector('.watchlist-link');
const searchIcon = document.querySelector('.search-icon');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const contentSection = document.querySelector('.content');
const movieIcon = document.querySelector('.movieIcon');

// Function to perform the movie search
function performMovieSearch() {
  const searchTerm = searchInput.value.trim(); // Get the search term from the input field

  // Make the API request
  fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${APIKEY}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        const movies = data.Search; // Retrieve the movies array from the API response

        // Clear existing content
        contentSection.innerHTML = '';

        // Fetch detailed information for each movie
        const moviePromises = movies.map(movie => {
          return fetch(`https://www.omdbapi.com/?i=${encodeURIComponent(movie.imdbID)}&apikey=${APIKEY}`)
            .then(response => response.json());
        });

        // Wait for all movie promises to resolve
        Promise.all(moviePromises)
          .then(movieData => {
            // Render each movie
            movieData.forEach(movie => {
              const movieElement = document.createElement('div');
              movieElement.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}">
                <div class="movie-details">
                    <h2 class="movie-title">${movie.Title}</h2>
                    <p class="movie-rating">Rating: ${movie.imdbRating}</p>
                    <p class="movie-length">Length: ${movie.Runtime}</p>
                    <p class="movie-genre">Genre: ${movie.Genre}</p>
                    <p class="movie-description">${movie.Plot}</p>
                    <button class="add-to-watchlist">Add to Watchlist</button>
                </div>
              `;
              contentSection.appendChild(movieElement);
            });
          })
          .catch(error => {
            console.log('Error fetching movie details:', error);
            contentSection.innerHTML = 'An error occurred while fetching movie details.';
          });
      } else {
        // Handle error or no results
        contentSection.innerHTML = 'No movies found.';
      }
    })
    .catch(error => {
      console.log('Error fetching movies:', error);
      contentSection.innerHTML = 'An error occurred while fetching the movies.';
    });
}

// Event listener for the search button
searchButton.addEventListener('click', performMovieSearch);

// Event listener for the Enter key press
searchInput.addEventListener('keypress', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault(); // Prevent the form from submitting
    performMovieSearch();
  }
});
