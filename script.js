const APIKEY = '5e713387';

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

              const addToWatchlistButton = document.createElement('button');
              addToWatchlistButton.classList.add('add-to-watchlist');
              addToWatchlistButton.textContent = 'Add to Watchlist';

              // Add click event listener to the "Add to Watchlist" button
              addToWatchlistButton.addEventListener('click', function () {
                addToWatchlist(movie);
              });

              // Append elements to the movie card
              movieDetails.appendChild(movieTitle);
              movieDetails.appendChild(movieRating);
              movieDetails.appendChild(movieLength);
              movieDetails.appendChild(movieGenre);
              movieDetails.appendChild(movieDescription);
              movieDetails.appendChild(addToWatchlistButton);

              movieCard.appendChild(moviePoster);
              movieCard.appendChild(movieDetails);

              contentSection.appendChild(movieCard);
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

// Function to show a modal with the specified message
function showModal(message) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalMessage = document.getElementById('modal-message');
  
    modalMessage.textContent = message;
    modal.style.display = 'block';
  
    // Close the modal when the user clicks anywhere outside of it
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  }

// Function to add a movie to the watchlist
function addToWatchlist(movie) {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || []; // Retrieve existing watchlist from local storage or create a new empty array

  // Check if the movie already exists in the watchlist
  const isMovieInWatchlist = watchlist.some(item => item.imdbID === movie.imdbID);

  if (!isMovieInWatchlist) {
    watchlist.push(movie); // Add the movie to the watchlist array
    localStorage.setItem('watchlist', JSON.stringify(watchlist)); // Save the updated watchlist to local storage
    showModal('Movie added to watchlist!');
  } else {
    showModal('Movie is already in the watchlist!');
  }
}
