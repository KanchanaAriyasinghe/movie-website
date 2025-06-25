// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors'); // <-- ADD THIS LINE

const app = express();
const PORT = 3000;

app.use(cors()); // <-- AND ADD THIS LINE to enable CORS for all requests

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// This line is no longer necessary if you are running the frontend
// on a separate server (like http-server), but it doesn't hurt to keep.
app.use(express.static('../frontend'));

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
        console.error('Error fetching popular movies:', error.message); // Added better logging
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
        console.error('Error searching for movies:', error.message); // Added better logging
        res.status(500).json({ message: 'Error searching for movies' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
