const apiBase = 'http://localhost:5000/movies';

let editingMovieId = null; // To track if editing a movie

// Fetch and display movies
async function fetchMovies() {
  try {
    const response = await fetch(apiBase);
    const movies = await response.json();
    displayMovies(movies);
  } catch (error) {
    alert('Failed to fetch movies');
  }
}

// Display movies below the input form
function displayMovies(movies) {
  const movieList = document.getElementById('movieList');
  movieList.innerHTML = '';
  movies.forEach((movie) => {
    movieList.innerHTML += `
      <div>
        <h3>${movie.name} (${movie.year}) - ${movie.genre}</h3>
        <button onclick="populateEditForm('${movie._id}', '${movie.name}', '${movie.genre}', '${movie.year}')">Edit</button>
        <button onclick="deleteMovie('${movie._id}')">Delete</button>
      </div>
    `;
  });
}

// Populate input fields for editing
function populateEditForm(id, name, genre, year) {
  document.getElementById('name').value = name;
  document.getElementById('genre').value = genre;
  document.getElementById('year').value = year;
  editingMovieId = id; // Set the movie ID being edited
}

// Add or update a movie
async function saveMovie() {
  const name = document.getElementById('name').value;
  const genre = document.getElementById('genre').value;
  const year = document.getElementById('year').value;

  if (!name || !genre || !year) {
    alert('Please fill in all fields');
    return;
  }

  try {
    if (editingMovieId) {
      // Update movie
      const response = await fetch(`${apiBase}/${editingMovieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, genre, year }),
      });
      const result = await response.json();
      alert(result.message);
      editingMovieId = null; // Reset after editing
    } else {
      // Add new movie
      const response = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, genre, year }),
      });
      const result = await response.json();
      alert(result.message);
    }
    document.getElementById('movieForm').reset();
    fetchMovies();
  } catch (error) {
    alert('Failed to save movie');
  }
}

// Delete a movie
async function deleteMovie(id) {
  try {
    const response = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
    const result = await response.json();
    alert(result.message);
    fetchMovies();
  } catch (error) {
    alert('Failed to delete movie');
  }
}

// Fetch movies on page load
fetchMovies();
