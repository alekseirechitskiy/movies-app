export default class MovieDBService {
  _BASE_URL = 'https://api.themoviedb.org/3';
  _API_KEY = '67794c82b9038fd6aca2a93ec32186a6';

  async getResource(url) {
    const res = await fetch(url);

    if (!res.ok) throw new Error(`Could not fetch ${url}, received ${res.status}`);

    return await res.json();
  }

  async getRatedMovies(guestSessionId, page = 1) {
    try {
      const res = await this.getResource(
        `${this._BASE_URL}/guest_session/${guestSessionId}/rated/movies?api_key=${this._API_KEY}&page=${page}`
      );
      return res.results;
    } catch (error) {
      console.error(error);
    }
  }

  async addRating(movieId, guestSessionId, rating) {
    try {
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
    } catch (error) {
      console.error(error);
    }
  }

  async getMovies(searchWord, pageNum = 1) {
    try {
      const res = await this.getResource(
        `${this._BASE_URL}/search/movie?query=${searchWord}&language=en-US&page=${pageNum}&api_key=${this._API_KEY}`
      );

      return res;
    } catch (error) {
      console.error(error);
    }
  }

  async createGuestSession() {
    try {
      const res = await this.getResource(`${this._BASE_URL}/authentication/guest_session/new?api_key=${this._API_KEY}`);

      return res.guest_session_id;
    } catch (error) {
      console.error('Guest session ERROR');
    }
  }

  async getGenres() {
    try {
      const res = await this.getResource(`${this._BASE_URL}/genre/movie/list?api_key=${this._API_KEY}`);

      return res.genres;
    } catch (error) {
      console.error('Genres ERROR');
    }
  }
}
