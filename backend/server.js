// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// API endpoint to get popular movies
app.get('/api/movies/popular', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
                page: 1
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching popular movies:', error.message);
        res.status(500).json({ message: 'Error fetching popular movies' });
    }
});

// API endpoint to search for movies
app.get('/api/movies/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                query: query
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error searching for movies:', error.message);
        res.status(500).json({ message: 'Error searching for movies' });
    }
});

// ==========================================================
// ==  UPDATED ENDPOINT WITH FALLBACK LOGIC  ==
// ==========================================================
app.get('/api/movie/:id/trailer', async (req, res) => {
    try {
        const movieId = req.params.id;
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
            params: {
                api_key: TMDB_API_KEY
            }
        });

        const videos = response.data.results;

        // 1. First, try to find an official "Trailer" on YouTube
        const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');

        if (trailer) {
            res.json({ key: trailer.key });
            return; // Exit after finding the best match
        }

        // 2. If no official trailer, find the first available video on YouTube (e.g., a teaser or clip)
        const fallbackVideo = videos.find(video => video.site === 'YouTube');
        
        if (fallbackVideo) {
            res.json({ key: fallbackVideo.key });
        } else {
            // 3. If no YouTube video is found at all
            res.status(404).json({ message: 'No trailer found' });
        }

    } catch (error) {
        console.error('Error fetching movie trailer:', error.message);
        res.status(500).json({ message: 'Error fetching movie trailer' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
