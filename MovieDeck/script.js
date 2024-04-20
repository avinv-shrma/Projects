let movies =[];
let currentPage = 1;
const moviesList = document.getElementById('movies-list');
const pagination = document.querySelector('.pagination');

function getMovieNamesFromLocalStorage(){
    const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));                //local storage se jab le rahe hai (get kiya) data to stringify krna pdega so JSON.parse krke local storage se le li movies list

    return favoriteMovies === null ? []: favoriteMovies; // simple check age already movies nahi hai to khaali array return kro wrna jo array hai bo return krdo
}

// function getMovieNamesFromLocalStorage() {
//     const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));
//     return favoriteMovies === null ? [] : favoriteMovies.map(movie => movie.name);
// }


function addMovieNameToLocalStorage(movie){
    const favoriteMovies = getMovieNamesFromLocalStorage(); //local storage me jo movies hai use le liya array bna ke array me push() kr skte hai 2 treeko se
    // // //Method1: 
    // favoriteMovies.push(movie);
    // localStorage.setItem('favoriteMovies', favoriteMovies)  //('keyName', aurJahaArraypushKrna hai) jo (get) kiya tha localStorage mein fir se set kr rahe hai use
    // // //Method2:
    localStorage.setItem('favoriteMovies', JSON.stringify([...favoriteMovies, movie]));   // local storage mein set kiya favorite movies ki jgah.. humne favoriteMovies ka array bna kr usko spead kiya fir usme movie daal di last mein
}

function removeMovieNameFromLocalStorage(movie){
    const favMovieName = getMovieNamesFromLocalStorage();
    localStorage.setItem('favoriteMovies', JSON.stringify(favMovieName.filter(movieName => movieName !== movie)));   // jo array aya usko filter lgaya aur check krege ki agar array me vo movie hai to usko show nahi kre baki sb movies ki list ko strigify krke return kr dega

}

function renderMovies(movies){
    moviesList.innerHTML ='';
    // console.log(movies, 'render');
    movies.map(movie => {
        const {poster_path, title, vote_average, vote_count} = movie;
        const listItem = document.createElement('li');
        listItem.className = 'card';

        let imgSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : 'images/video.png' ; // agr bychance data me nahi aya to we should have a fall back option to thumbnail daalo
        
        listItem.innerHTML += `<img class="poster" src = ${imgSrc} alt="movie-title">
        <p class="title">${title}</p>
        <section class="vote-favoriteIcon">
            <section class="vote">
                <p class="vote-count">Votes: ${vote_count}</p>
                <p class="vote-average">Rating: ${vote_average}</p>
            </section>
            <i class="fa-regular fa-heart fa-2xl favorite-icon" id="${title}"></i>
        </section>
        `
        const favoriteIconBtn = listItem.querySelector('.favorite-icon');
        favoriteIconBtn.addEventListener('click', (event)=>{
            const {id} = event.target;

            if(favoriteIconBtn.classList.contains("fa-solid")){
                removeMovieNameFromLocalStorage(id);
                favoriteIconBtn.classList.remove('fa-solid');
            }else{
                addMovieNameToLocalStorage(id);
                favoriteIconBtn.classList.add("fa-solid");
            }
        });
        moviesList.appendChild(listItem);
    });
    
}



async function fetchMovies(page){
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${page}`);
        const result = await response.json();

        movies = result.results;     // result entire object hai jiske andr results ke array mein movies ki list hai console me dekh skte ho
        renderMovies(movies);   //console.log krke dekhte hai renderMovies me ki hme data mil raha hai ya nahi?

        // console.log(result, 'Res');
    }catch(err){

    }
}

fetchMovies(currentPage);

let firstSortByDateClick = true;
const sortByDateButton = document.getElementById('sort-by-date');

function sortByDate(){
    let sortedMovies ;
    if(firstSortByDateClick){
        sortedMovies = movies.sort((a,b) => new Date(a.release_date) - new Date(b.release_date));
        sortByDateButton.innerText = 'Sorted by date (oldest to latest)';
        firstSortByDateClick = false;

        //resetting sortbyrating
        sortByRateButton.innerText = 'Sort by rating (least to most)';
        firstSortByRatingClick = true;
    }else if(!firstSortByDateClick){
        sortedMovies = movies.sort((a,b) => new Date(b.release_date) - new Date(a.release_date));
        sortByDateButton.innerText = 'Sorted by date (latest to oldest)';
        firstSortByDateClick = true;

        //resetting sortbyrating
        sortByRateButton.innerText = 'Sort by rating (least to most)';
        firstSortByRatingClick = true;
    }
    renderMovies(sortedMovies);
}
sortByDateButton.addEventListener('click', sortByDate); 


let firstSortByRatingClick = true;
const sortByRateButton = document.getElementById('sort-by-rating');

function sortByRating(){
    let sortedMovies;
    if(firstSortByRatingClick){
        sortedMovies = movies.sort((a,b) => a.vote_average - b.vote_average);
        sortByRateButton.innerText = 'Sorted by rating (least to most)';
        firstSortByRatingClick = false;

        //restting sortbydate
        sortByDateButton.innerText = 'Sort by date (oldest to latest)';
        firstSortByDateClick = true;        
    }else if(!firstSortByRatingClick){
        sortedMovies = movies.sort((a,b) => b.vote_average - a.vote_average);
        sortByRateButton.innerText = 'Sorted by rating (most to least)';
        firstSortByRatingClick = true;

        //restting sortbydate
        sortByDateButton.innerText = 'Sort by date (oldest to latest)';
        firstSortByDateClick = true;
    }
    renderMovies(sortedMovies);
}
sortByRateButton.addEventListener('click', sortByRating);

const prevButton = document.querySelector('#prev-button');
const pageNumberButton = document.querySelector('#page-number-button')
const nextButton = document.querySelector('#next-button')


prevButton.disabled = true;

prevButton.addEventListener('click',() => {
    currentPage--;
    fetchMovies(currentPage);
    pageNumberButton.innerHTML = `Current Page ${currentPage}`;
    if(currentPage === 1){
        prevButton.disabled = true;
        nextButton.disabled = false;

    }else if(currentPage === 2){
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
});
nextButton.addEventListener('click', ()=>{
    currentPage++;
    fetchMovies(currentPage);
    pageNumberButton.innerText = `Current Page ${currentPage}`;

    if(currentPage === 3){
        prevButton.disabled = false;
        nextButton.disabled = true;
    }else if (currentPage === 2){
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
})


const searchMovies = async (searchedMovie) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchedMovie}&api_key=f531333d637d0c44abc85b3e74db2186&include_adult=false&language=en-US&page=1`);
        const data = await response.json();
        movies = data.results;
        renderMovies(movies);
    }catch(err){
        console.log(err);
    }
}


const searchButton = document.querySelector('#search-button');
const searchInput = document.getElementById("search-input");

searchButton.addEventListener('click', ()=>{
    searchMovies(searchInput.value);
    pagination.style.display = 'none';

})

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchMovies(searchInput.value);
        pagination.style.display = 'none';
        searchButton.click(); // Simulate a click event on the search button
    }
});

const showFavorites = favMovieName => {
    const {poster_path, title, vote_average, vote_count} = favMovieName;
        const listItem = document.createElement('li');
        listItem.className = 'card';

        let imgSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : 'images/video.png' ; // agr bychance data me nahi aya to we should have a fall back option to thumbnail daalo
        
        listItem.innerHTML += `<img class="poster" src = ${imgSrc} alt="movie-title">
        <p class="title">${title}</p>
        <section class="vote-favoriteIcon">
            <section class="vote">
                <p class="vote-count">Votes: ${vote_count}</p>
                <p class="vote-average">Rating: ${vote_average}</p>
            </section>
            <i class=" favorite-icon fa-solid fa-xmark fa-xl xmark " id="${title}"></i>
        </section>`


        const removeFromWishList = listItem.querySelector('.xmark');
        removeFromWishList.addEventListener('click', (e) => { const {id} = e.target;
            fetchWishListMovie();
            moviesList.appendChild(listItem);
        })
}

const getMovieByName = async (movieName)=>{
    try{
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=f531333d637d0c44abc85b3e74db2186&include_adult=false&language=en-US&page=1`);

        const result = await response.json();
        return result.results[0];

    }catch(err){
        console.log(err.message);
    }
}


const fetchWishListMovie = async() => {
    moviesList.innerHTML = '';
    const movieNameList = getMovieNamesFromLocalStorage();
    for (let i =0; i < movieNameList.length ; i++){
        const movieName = movieNameList[i];
        const movieDataFromName = await getMovieByName(movieName);
        showFavorites(movieDataFromName);
    }
}


const allTab = document.querySelector('#all-tab')
const favoritesTab = document.querySelector('#favorites-tab');
const sortBtns = document.querySelector('.sorting-options');

function displayMovies() {
    if (allTab.classList.contains("active-tab")){
        renderMovies(movies);
        sortBtns.style = "revert";
        pagination.style = "revert";
    }else if (favoritesTab.classList.contains('active-tab')){
        fetchWishListMovie();
        sortBtns.style.display = "none";
        pagination.style.display = "none";
    }
}

function switchTab(event){
    allTab.classList.remove('active-tab');
    favoritesTab.classList.remove('active-tab');

    event.target.classList.add('active-tab');

    displayMovies();
}

allTab.addEventListener('click', switchTab);
favoritesTab.addEventListener('click', switchTab);


