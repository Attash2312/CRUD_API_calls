const apiUrl = 'https://672de049fd89797156441457.mockapi.io/api/movie';
const movieNameInput = document.getElementById('movie-name');
const submitButton = document.getElementById('submit-btn');
const movieListContainer = document.getElementById('movie-list');
let editingMovieId = null;

// Function to fetch and render the movie list
async function fetchMovies() {
    const response = await fetch(apiUrl);
    const movies = await response.json();
    renderMovieList(movies);
}

// Function to render the movie list to the DOM
function renderMovieList(movies) {
    movieListContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `
            <span class="movie-name">${movie.name}</span>
            <div>
                <button class="edit-button" onclick="startEditMovie(${movie.id})">Edit</button>
                <button onclick="deleteMovie(${movie.id})">Delete</button>
            </div>
        `;
        movieListContainer.appendChild(movieItem);
    });
}

// Function to add or update a movie
async function addOrUpdateMovie() {
    const movieName = movieNameInput.value.trim();

    if (!movieName) return;

    const movieData = { name: movieName };

    if (editingMovieId) {
        // Update the movie
        await fetch(`${apiUrl}/${editingMovieId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movieData)
        });
        editingMovieId = null;
        submitButton.textContent = 'Add Movie';
    } else {
        // Add a new movie
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movieData)
        });
    }

    movieNameInput.value = ''; // Clear input field
    fetchMovies(); // Refresh the movie list
}

// Function to delete a movie
async function deleteMovie(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });
    fetchMovies(); // Refresh the movie list
}

// Function to start editing a movie
function startEditMovie(id) {
    editingMovieId = id;
    const movieName = document.querySelector(`.movie-item:nth-child(${id}) .movie-name`).textContent;
    movieNameInput.value = movieName;
    submitButton.textContent = 'Update Movie';
}

// Add event listener to submit button
submitButton.addEventListener('click', addOrUpdateMovie);

// Fetch and render movies when the page loads
document.addEventListener('DOMContentLoaded', fetchMovies);
