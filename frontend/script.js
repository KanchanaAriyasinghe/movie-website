// script.js - FULL UPDATED CODE

const movieContainer = document.getElementById('movie-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('trailer-modal');
const closeButton = document.getElementById('close-button');
const videoContainer = document.getElementById('video-container');

const API_BASE_URL = 'http://localhost:3000/api';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// ---- DISPLAY MOVIES ----
function displayMovies(movies) {
    movieContainer.innerHTML = '';
    movies.forEach(movie => {
        if (movie.poster_path) {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            
            // Add movie ID as a data attribute
            movieCard.dataset.movieId = movie.id; 

            movieCard.innerHTML = `
                <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
            `;
            movieContainer.appendChild(movieCard);
        }
    });
}

// ---- FETCH MOVIES ----
async function getPopularMovies() {
    try {
        const response = await fetch(`${API_BASE_URL}/movies/popular`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

async function searchMovies(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/movies/search?q=${query}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

// ---- TRAILER LOGIC ----
async function playTrailer(movieId) {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/${movieId}/trailer`);
        if (!response.ok) {
            alert('Trailer not found!');
            return;
        }
        const data = await response.json();
        const trailerKey = data.key;

        // Create YouTube iframe
        videoContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${trailerKey}?autoplay=1" 
                frameborder="0" 
                allow="autoplay; encrypted-media" 
                allowfullscreen>
            </iframe>
        `;

        // Show the modal
        modal.classList.remove('hidden');

    } catch (error) {
        console.error('Error playing trailer:', error);
        alert('Could not load trailer.');
    }
}

function closeModal() {
    modal.classList.add('hidden');
    // Stop the video by clearing the iframe content
    videoContainer.innerHTML = '';
}

// ---- EVENT LISTENERS ----
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        searchMovies(searchTerm);
    } else {
        getPopularMovies();
    }
});

// Event listener for clicking on a movie card
movieContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.movie-card');
    if (card) {
        const movieId = card.dataset.movieId;
        playTrailer(movieId);
    }
});

// Event listeners for closing the modal
closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    // Close modal if the dark overlay is clicked, but not the content inside
    if (e.target === modal) {
        closeModal();
    }
});

// Initial load
getPopularMovies();
