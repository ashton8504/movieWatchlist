// watchlist.js

const watchlistSection = document.querySelector('.watchlist-section');

// Retrieve the watchlist from local storage
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Function to remove a movie from the watchlist
function removeFromWatchlist(imdbID) {
  watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
  // Update the watchlist in local storage
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  // Re-render the watchlist
  renderWatchlist();
}

// Function to render the watchlist
function renderWatchlist() {
  watchlistSection.innerHTML = '';

  if (watchlist.length > 0) {
    watchlist.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');

      const moviePoster = document.createElement('img');
      moviePoster.src = movie.Poster;
      moviePoster.alt = movie.Title;
      moviePoster.classList.add('movie-poster');

      const movieDetails = document.createElement('div');
      movieDetails.classList.add('movie-details');

      const movieTitle = document.createElement('h2');
      movieTitle.classList.add('movie-title');
      movieTitle.textContent = movie.Title;

      const movieRating = document.createElement('p');
      movieRating.classList.add('movie-rating');
      movieRating.textContent = `Rating: ${movie.imdbRating}`;

      const movieLength = document.createElement('p');
      movieLength.classList.add('movie-length');
      movieLength.textContent = `Length: ${movie.Runtime}`;

      const movieGenre = document.createElement('p');
      movieGenre.classList.add('movie-genre');
      movieGenre.textContent = `Genre: ${movie.Genre}`;

      const movieDescription = document.createElement('p');
      movieDescription.classList.add('movie-description');
      movieDescription.textContent = movie.Plot;

      const removeFromWatchlistButton = document.createElement('button');
      removeFromWatchlistButton.classList.add('remove-from-watchlist');
      removeFromWatchlistButton.textContent = 'Remove from Watchlist';
      removeFromWatchlistButton.addEventListener('click', () => {
        removeFromWatchlist(movie.imdbID);
      });

      // Append elements to the movie card
      movieDetails.appendChild(movieTitle);
      movieDetails.appendChild(movieRating);
      movieDetails.appendChild(movieLength);
      movieDetails.appendChild(movieGenre);
      movieDetails.appendChild(movieDescription);
      movieDetails.appendChild(removeFromWatchlistButton);

      movieCard.appendChild(moviePoster);
      movieCard.appendChild(movieDetails);

      watchlistSection.appendChild(movieCard);
    });
  } else {
    watchlistSection.innerHTML = 'No movies in the watchlist.';
  }
}

// Render the initial watchlist
renderWatchlist();
