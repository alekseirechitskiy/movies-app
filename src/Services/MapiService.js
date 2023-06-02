export default class MovieDBService {
  // _GLOBAL_URL = `https://api.themoviedb.org/3/search/movie?query=${this._SEARCH_WORD}&include_adult=false&language=en-US&page=1&api_key=${this._API_KEY}`;

  // _SEARCH_WORD = 'return';

  _BASE_URL = 'https://api.themoviedb.org/3';
  _API_KEY = '67794c82b9038fd6aca2a93ec32186a6';

  async getResource(url) {
    const res = await fetch(url); // возвращает Promise
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.ststus}`);
    }
    return await res.json();
  }

  // _transformData(movie) {
  //   return {
  //     title: movie.title,
  //     releaseDate: movie.release_date,
  //     overview: movie.overview,
  //     posterPath: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
  //   };
  // }

  async getRatedMovies(guestSessionId, page = 1) {
    const res = await fetch(
      `${this._BASE_URL}/guest_session/${guestSessionId}/rated/movies?api_key=${this._API_KEY}&page=${page}`,
      { method: 'GET' }
    );

    if (!res.ok) {
      throw new Error('Could not get rated movies.');
    }

    const data = await res.json();

    console.log('MY RATED MOVIES:', data.results);

    return data.results;
  }

  async addRating(movieId, guestSessionId, rating) {
    const res = await fetch(
      `${this._BASE_URL}/movie/${movieId}/rating?api_key=${this._API_KEY}&guest_session_id=${guestSessionId}`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: rating }),
      }
    );

    if (!res.ok) {
      throw new Error('Adding rating error');
    }
  }

  async getMovies(searchWord, pageNum = 1) {
    // console.log('searchWord, pageNum: ', searchWord, pageNum);
    const res = await this.getResource(
      `${this._BASE_URL}/search/movie?query=${searchWord}&language=en-US&page=${pageNum}&api_key=${this._API_KEY}`
    );

    return res;
  }

  async createGuestSession() {
    const res = await fetch(`${this._BASE_URL}/authentication/guest_session/new?api_key=${this._API_KEY}`, {
      method: 'GET',
    });

    if (!res.ok) throw new Error('Guest token response failed');

    const data = await res.json();

    return data.guest_session_id;
  }

  async getGenres() {
    const res = await fetch(`${this._BASE_URL}/genre/movie/list?api_key=${this._API_KEY}`, {
      method: 'GET',
    });

    if (!res.ok) throw new Error('Genres list response failed');

    const data = await res.json();

    return data.genres;
  }
}
