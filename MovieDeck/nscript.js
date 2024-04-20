let movies = [];
let currentPage = 1;
const moviesList = document.getElementById('movies-list');
const pagination = document.querySelector('.pagination');

// Function to get movie names from localStorage
function getMovieNamesFromLocalStorage() {
    const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));
    return favoriteMovies === null ? [] : favoriteMovies;
}

// Function to add a movie name to localStorage
function addMovieNameToLocalStorage(movie) {
    const favoriteMovies = getMovieNamesFromLocalStorage();
    localStorage.setItem('favoriteMovies', JSON.stringify([...favoriteMovies, movie]));
}

// Function to remove a movie name from localStorage
function removeMovieNameFromLocalStorage(movie) {
    const favMovieName = getMovieNamesFromLocalStorage();
    localStorage.setItem('favoriteMovies', JSON.stringify(favMovieName.filter(movieName => movieName !== movie)));
}

// Function to render movies on the page
function renderMovies(movies) {
    moviesList.innerHTML = '';
    movies.map(movie => {
        const {poster_path, title, vote_average, vote_count} = movie;
        const listItem = document.createElement('li');
        listItem.className = 'card';

        let imgSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : 'images/video.png';
        
        listItem.innerHTML += `<img class="poster" src="${imgSrc}" alt="movie-title">
        <p class="title">${title}</p>
        <section class="vote-favoriteIcon">
            <section class="vote">
                <p class="vote-count">Votes: ${vote_count}</p>
                <p class="vote-average">Rating: ${vote_average}</p>
            </section>
            <i class="fa-regular fa-heart fa-2xl favorite-icon" id="${title}"></i>
        </section>`;

        const favoriteIconBtn = listItem.querySelector('.favorite-icon');
        favoriteIconBtn.addEventListener('click', (event) => {
            const { id } = event.target;

            if (favoriteIconBtn.classList.contains("fa-solid")) {
                removeMovieNameFromLocalStorage(id);
                favoriteIconBtn.classList.remove('fa-solid');
            } else {
                addMovieNameToLocalStorage(id);
                favoriteIconBtn.classList.add("fa-solid");
            }
        });
        moviesList.appendChild(listItem);
    });
}

// Function to fetch movies from API
async function fetchMovies(page) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${page}`);
        const result = await response.json();
        movies = result.results;
        renderMovies(movies);
    } catch (err) {
        console.log(err);
    }
}

fetchMovies(currentPage);

// Function to sort movies by date
function sortByDate() {
    let sortedMovies;
    if (firstSortByDateClick) {
        sortedMovies = movies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        sortByDateButton.innerText = 'Sorted by date (oldest to latest)';
        firstSortByDateClick = false;

        // Resetting sort by rating
        sortByRateButton.innerText = 'Sort by rating (least to most)';
        firstSortByRatingClick = true;
    } else if (!firstSortByDateClick) {
        sortedMovies = movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        sortByDateButton.innerText = 'Sorted by date (latest to oldest)';
        firstSortByDateClick = true;

        // Resetting sort by rating
        sortByRateButton.innerText = 'Sort by rating (least to most)';
        firstSortByRatingClick = true;
    }
    renderMovies(sortedMovies);
}

// Event listener for sorting by date button
sortByDateButton.addEventListener('click', sortByDate);

// Function to sort movies by rating
function sortByRating() {
    let sortedMovies;
    if (firstSortByRatingClick) {
        sortedMovies = movies.sort((a, b) => a.vote_average - b.vote_average);
        sortByRateButton.innerText = 'Sorted by rating (least to most)';
        firstSortByRatingClick = false;

        // Resetting sort by date
        sortByDateButton.innerText = 'Sort by date (oldest to latest)';
        firstSortByDateClick = true;
    } else if (!firstSortByRatingClick) {
        sortedMovies = movies.sort((a, b) => b.vote_average - a.vote_average);
        sortByRateButton.innerText = 'Sorted by rating (most to least)';
        firstSortByRatingClick = true;

        // Resetting sort by date
        sortByDateButton.innerText = 'Sort by date (oldest to latest)';
        firstSortByDateClick = true;
    }
    renderMovies(sortedMovies);
}

// Event listener for sorting by rating button
sortByRateButton.addEventListener('click', sortByRating);

// Previous button event listener
prevButton.disabled = true;
prevButton.addEventListener('click', () => {
    currentPage--;
    fetchMovies(currentPage);
    pageNumberButton.innerHTML = `Current Page ${currentPage}`;
    if (currentPage === 1) {
        prevButton.disabled = true;
        nextButton.disabled = false;
    } else if (currentPage === 2) {
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
});

// Next button event listener
nextButton.addEventListener('click', () => {
    currentPage++;
    fetchMovies(currentPage);
    pageNumberButton.innerText = `Current Page ${currentPage}`;
    if (currentPage === 3) {
        prevButton.disabled = false;
        nextButton.disabled = true;
    } else if (currentPage === 2) {
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
});

// Function to search movies
const searchMovies = async (searchedMovie) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchedMovie}&api_key=f531333d637d0c44abc85b3e74db2186&include_adult=false&language=en-US&page=1`);
        const data = await response.json();
        movies = data.results;
        renderMovies(movies);
    } catch (err) {
        console.log(err);
    }
}

// Event listener for search button
searchButton.addEventListener('click', () => {
    searchMovies(searchInput.value);
    pagination.style.display = 'none';
});

// Event listener for search input keydown event
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchMovies(searchInput.value);
        pagination.style.display = 'none';
        searchButton.click(); // Simulate a click event on the search button
    }
});

// Function to display favorite movies
const showFavorites = favMovieName => {
    const {poster_path, title, vote_average, vote_count} = favMovieName;
    const listItem = document.createElement('li');
    listItem.className = 'card';

    let imgSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : 'images/video.png';
    
    listItem.innerHTML += `<img class="poster" src="${imgSrc}" alt="movie-title">
    <p class="title">${title}</p>
    <section class="vote-favoriteIcon">
        <section class="vote">
            <p class="vote-count">Votes: ${vote_count}</p>
            <p class="vote-average">Rating: ${vote_average}</p>
        </section>
        <i class="favorite-icon fa-solid fa-xmark fa-xl xmark" id="${title}"></i>
    </section>`;

    const removeFromWishList = listItem.querySelector('.xmark');
    removeFromWishList.addEventListener('click', (e) => {
        const {id} = e.target;
        removeMovieNameFromLocalStorage(id);
        moviesList.appendChild(listItem); // This line might need review. Ensure 'moviesList' is correctly defined and the logic aligns with your requirements.
    });
}

// Function to get movie data by name
const getMovieByName = async (movieName) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=f531333d637d0c44abc85b3e74db2186&include_adult=false&language=en-US&page=1`);
        const result = await response.json();
        return result.results[0];
    } catch (err) {
        console.log(err.message);
    }
}

// Function to fetch wish list movies
const fetchWishListMovie = async () => {
    moviesList.innerHTML = '';
    const movieNameList = getMovieNamesFromLocalStorage();
    for (let i = 0; i < movieNameList.length; i++) {
        const movieName = movieNameList[i];
        const movieDataFromName = await getMovieByName(movieName);
        showFavorites(movieDataFromName);
    }
}

// Function to display movies based on active tab
function displayMovies() {
    if (allTab.classList.contains("active-tab")) {
        renderMovies(movies);
        sortBtns.style = "revert";
        pagination.style = "revert";
    } else if (favoritesTab.classList.contains('active-tab')) {
        fetchWishListMovie();
        sortBtns.style.display = "none";
        pagination.style.display = "none";
    }
}

// Event listener for tab switch
function switchTab(event) {
    allTab.classList.remove('active-tab');
    favoritesTab.classList.remove('active-tab');
    event.target.classList.add('active-tab');
    displayMovies();
}

// Event listeners for tab click
allTab.addEventListener('click', switchTab);
favoritesTab.addEventListener('click', switchTab);
