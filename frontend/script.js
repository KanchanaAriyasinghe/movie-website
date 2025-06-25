const movieContainer = document.getElementById('movie-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

const API_BASE_URL = 'http://localhost:3000/api';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Function to display movies
function displayMovies(movies) {
    movieContainer.innerHTML = ''; // Clear previous results
    movies.forEach(movie => {
        if (movie.poster_path) { // Only display movies with posters
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            movieCard.innerHTML = `
                <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
            `;
            movieContainer.appendChild(movieCard);
        }
    });
}

// Function to get popular movies
async function getPopularMovies() {
    try {
        const response = await fetch(`${API_BASE_URL}/movies/popular`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Function to search movies
async function searchMovies(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/movies/search?q=${query}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

// Event listener for search form
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        searchMovies(searchTerm);
    } else {
        getPopularMovies(); // If search is empty, show popular movies
    }
});

// Initial load: Get popular movies
getPopularMovies();
