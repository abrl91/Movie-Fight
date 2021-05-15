let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, target, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'ccd3201a',
            i: movie.imdbID,
        }
    });

    document.querySelector(target).innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summery .notification');
    const rightSideStats = document.querySelectorAll('#right-summery .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }

    });
}

const autocompleteConfig = {
    renderOption: movie => {
        const imgSrc = movie.Poster !== "N/A" ? movie.Poster : "";
        return `
            <img src="${imgSrc}"/>
             ${movie.Title} (${movie.Year})
         `;
    },
    inputValue: movie => {
        return movie.Title;
    },
    fetchData: async (searchTerm) => {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: 'ccd3201a',
                s: searchTerm,
            }
        });

        if (response.data.Error) return [];

        return response.data.Search;
    }
}

createAutocomplete({
    ...autocompleteConfig,
    searchedTitle: 'Search Movie 1',
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect: async movie => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        await onMovieSelect(movie, '#left-summery', 'left');
    },
});

createAutocomplete({
    ...autocompleteConfig,
    searchedTitle: 'Search Movie 2',
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect: async movie => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        await onMovieSelect(movie, '#right-summery', 'right');
    },
});

const movieTemplate = (movieDetails) => {
    const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const mataScore = parseInt(movieDetails.Metascore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));
    const awards = movieDetails.Awards.split(' ').reduce((acc, currVal) => {
        const value = parseInt(currVal);
        if (isNaN(value)) return acc;
        return  acc + value;
    }, 0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</h1>    
                    <h4>${movieDetails.Genre}</h4>    
                    <p>${movieDetails.Plot}</p>    
                </div>
            </div>
        </article>
        <article data-value="${awards}" class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value="${dollars}" class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">BoxOffice</p>
        </article>
        <article data-value="${mataScore}" class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value="${imdbRating}" class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value="${imdbVotes}" class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
};
