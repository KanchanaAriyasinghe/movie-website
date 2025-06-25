// script.js - FULL UPDATED CODE
const movieContainer = document.getElementById('movie-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('trailer-modal');
const closeButton = document.getElementById('close-button');
const videoContainer = document.getElementById('video-container');

const API_BASE_URL = 'http://localhost:3000/api';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function displayMovies(movies) {
    movieContainer.innerHTML = '';
    movies.forEach(movie => {
        if (movie.poster_path) {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.dataset.movieId = movie.id;
            movieCard.innerHTML = `
                <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
            `;
            movieContainer.appendChild(movieCard);
        }
    });
}

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

// ===============================================
// == UPDATED playTrailer FUNCTION ==
// ===============================================
async function playTrailer(movieId) {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/${movieId}/trailer`);
        
        // If the response is not OK (e.g., 404 Not Found)
        if (!response.ok) {
            videoContainer.innerHTML = `<div class="trailer-not-found">Trailer not available for this movie.</div>`;
        } else {
            const data = await response.json();
            const trailerKey = data.key;
            // Create YouTube iframe if a key is found
            videoContainer.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0" 
                    frameborder="0" 
                    allow="autoplay; encrypted-media" 
                    allowfullscreen>
                </iframe>
            `;
        }

        // Show the modal regardless of whether a trailer was found
        modal.classList.remove('hidden');

    } catch (error) {
        console.error('Error playing trailer:', error);
        // Display a generic error message in the modal
        videoContainer.innerHTML = `<div class="trailer-not-found">Could not load trailer due to an error.</div>`;
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    modal.classList.add('hidden');
    videoContainer.innerHTML = ''; // Clear the video/message
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        searchMovies(searchTerm);
    } else {
        getPopularMovies();
    }
});

movieContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.movie-card');
    if (card) {
        const movieId = card.dataset.movieId;
        playTrailer(movieId);
    }
});

closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

getPopularMovies();
