document.addEventListener("DOMContentLoaded", function () {
  // State variables
  let currentPage = 1;
  let currentQuery = "";
  let currentFilter = "movie";

  // Elements
  const searchBar = document.getElementById("search-bar");
  const topPrevPage = document.getElementById("top-prev-page");
  const topNextPage = document.getElementById("top-next-page");
  const bottomPrevPage = document.getElementById("bottom-prev-page");
  const bottomNextPage = document.getElementById("bottom-next-page");
  const moviesLink = document.getElementById("movies-link");
  const tvShowsLink = document.getElementById("tvshows-link");
  const newLink = document.getElementById("new-link");
  const popularLink = document.getElementById("popular-link");
  const resultsContainer = document.getElementById("results");
  const spinner = document.getElementById("spinner");
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("close-btn");
  const modalContent = document.getElementById("modal-content");

  // Check for essential elements
  if (!searchBar) {
    console.error("Search bar element not found");
    return;
  }

  if (!topPrevPage || !topNextPage || !bottomPrevPage || !bottomNextPage) {
    console.error("Pagination buttons not found");
    return;
  }

  if (!moviesLink || !tvShowsLink || !newLink || !popularLink) {
    console.error("Nav links not found");
    return;
  }

  // Add event listeners for navigation links
  if (moviesLink) {
    moviesLink.addEventListener("click", function () {
      currentFilter = "movie";
      currentPage = 1;
      fetchMovies(currentQuery, currentPage, currentFilter);
    });
  }

  if (tvShowsLink) {
    tvShowsLink.addEventListener("click", function () {
      currentFilter = "tv";
      currentPage = 1;
      fetchMovies(currentQuery, currentPage, currentFilter);
    });
  }

  if (newLink) {
    newLink.addEventListener("click", function () {
      currentFilter = "new";
      currentPage = 1;
      fetchMovies(currentQuery, currentPage, currentFilter);
    });
  }

  if (popularLink) {
    popularLink.addEventListener("click", function () {
      currentFilter = "popular";
      currentPage = 1;
      fetchMovies(currentQuery, currentPage, currentFilter);
    });
  }

  // Event Listeners
  searchBar.addEventListener("input", function () {
    const query = this.value;
    if (query.length > 2) {
      currentQuery = query;
      currentPage = 1;
      fetchMovies(query, currentPage, currentFilter);
    }
  });

  topPrevPage.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      fetchMovies(currentQuery, currentPage, currentFilter);
    }
  });

  topNextPage.addEventListener("click", function () {
    currentPage++;
    fetchMovies(currentQuery, currentPage, currentFilter);
  });

  bottomPrevPage.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      fetchMovies(currentQuery, currentPage, currentFilter);
    }
  });

  bottomNextPage.addEventListener("click", function () {
    currentPage++;
    fetchMovies(currentQuery, currentPage, currentFilter);
  });

  moviesLink.addEventListener("click", function () {
    currentFilter = "movie";
    currentPage = 1;
    fetchMovies(currentQuery, currentPage, currentFilter);
  });

  tvShowsLink.addEventListener("click", function () {
    currentFilter = "tv";
    currentPage = 1;
    fetchMovies(currentQuery, currentPage, currentFilter);
  });

  newLink.addEventListener("click", function () {
    currentFilter = "new";
    currentPage = 1;
    fetchMovies(currentQuery, currentPage, currentFilter);
  });

  popularLink.addEventListener("click", function () {
    currentFilter = "popular";
    currentPage = 1;
    fetchMovies(currentQuery, currentPage, currentFilter);
  });

  // Fetch Movies
  function fetchMovies(query, page, filter) {
    const apiKey = "6573955e203c7d1d288cb9d658bdda89";
    let url = "";

    switch (filter) {
      case "movie":
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`;
        break;
      case "tv":
        url = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${query}&page=${page}`;
        break;
      case "new":
        url = `https://api.themoviedb.org/3/movie/latest?api_key=${apiKey}`;
        break;
      case "popular":
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
        break;
    }

    showSpinner();

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        displayMovies(data.results);
        updatePagination(data.page, data.total_pages, data.results.length > 0);
        hideSpinner();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        hideSpinner();
      });
  }

  // Display Movies
  function displayMovies(movies) {
    resultsContainer.innerHTML = "";

    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.className = "movie-card";

      const movieImage = document.createElement("img");
      movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      movieImage.alt = movie.title || movie.name;

      const movieTitle = document.createElement("h3");
      movieTitle.textContent = movie.title || movie.name;

      const movieDescription = document.createElement("p");
      movieDescription.textContent = `Description: ${movie.overview}`;

      const movieReleaseDate = document.createElement("p");
      movieReleaseDate.textContent = `Release Date: ${
        movie.release_date || movie.first_air_date
      }`;

      // Append movie details to the movieCard
      movieCard.appendChild(movieImage);
      movieCard.appendChild(movieTitle);
      movieCard.appendChild(movieDescription);
      movieCard.appendChild(movieReleaseDate);

      // Fetch additional details for cast and genre
      fetchMovieDetails(movie.id, movieCard, currentFilter);

      resultsContainer.appendChild(movieCard);
    });
  }

  // Fetch Movie Details
  function fetchMovieDetails(movieId, movieCard, filter) {
    const apiKey = "6573955e203c7d1d288cb9d658bdda89";
    const detailsUrl = `https://api.themoviedb.org/3/${filter}/${movieId}?api_key=${apiKey}`;
    const creditsUrl = `https://api.themoviedb.org/3/${filter}/${movieId}/credits?api_key=${apiKey}`;

    // Fetch movie details for genre
    fetch(detailsUrl)
      .then((response) => response.json())
      .then((data) => {
        const movieGenre = document.createElement("p");
        movieGenre.textContent = `Genre: ${data.genres
          .map((genre) => genre.name)
          .join(", ")}`;
        movieCard.appendChild(movieGenre);
      })
      .catch((error) => console.error("Error fetching movie details:", error));

    // Fetch movie credits for cast
    fetch(creditsUrl)
      .then((response) => response.json())
      .then((data) => {
        const movieCast = document.createElement("p");
        movieCast.textContent = `Cast: ${data.cast
          .slice(0, 3)
          .map((actor) => actor.name)
          .join(", ")}`;
        movieCard.appendChild(movieCast);
      })
      .catch((error) => console.error("Error fetching movie credits:", error));
  }

  // Update Pagination
  function updatePagination(currentPage, totalPages, hasResults) {
    const topPagination = document.getElementById("top-pagination");
    const bottomPagination = document.getElementById("bottom-pagination");

    if (hasResults) {
      topPagination.style.display = "block";
      bottomPagination.style.display = "block";
    } else {
      topPagination.style.display = "none";
      bottomPagination.style.display = "none";
    }

    const prevButtons = document.querySelectorAll(
      "#top-prev-page, #bottom-prev-page"
    );
    const nextButtons = document.querySelectorAll(
      "#top-next-page, #bottom-next-page"
    );

    prevButtons.forEach((button) => (button.disabled = currentPage === 1));
    nextButtons.forEach(
      (button) => (button.disabled = currentPage === totalPages)
    );
  }

  // Spinner Functions
  function showSpinner() {
    spinner.style.display = "block";
  }

  function hideSpinner() {
    spinner.style.display = "none";
  }

  if (!newLink) console.error("New link not found");

  // Function to disable the New Movies link
  function disableLink(link) {
    link.classList.add("disabled");
    link.onclick = (event) => {
      event.preventDefault();
    };
  }
  disableLink(newLink);
});
