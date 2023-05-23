export default class MovieDBService {
  // _GLOBAL_URL = `https://api.themoviedb.org/3/search/movie?query=${this._SEARCH_WORD}&include_adult=false&language=en-US&page=1&api_key=${this._API_KEY}`;

  // _SEARCH_WORD = 'return';
  _API_KEY = '67794c82b9038fd6aca2a93ec32186a6';

  async getResource(url) {
    const res = await fetch(url); // возвращает Promise
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.ststus}`);
    }
    return await res.json();
  }

  _transformData(movie) {
    return {
      title: movie.title,
      releaseDate: movie.release_date,
      overview: movie.overview,
      posterPath: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
    };
  }

  async getMovies(searchWord, pageNum = 1) {
    console.log('searchWord, pageNum: ', searchWord, pageNum);
    const res = await this.getResource(
      `https://api.themoviedb.org/3/search/movie?query=${searchWord}&include_adult=false&language=en-US&page=${pageNum}&api_key=${this._API_KEY}`
    );
    // console.log('res: ', res.results);
    // return res.results;

    return res;
    // return res.results.map((movie) => console.log(this._transformData(movie)));
  }
}
