import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './components/app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 'https://api.themoviedb.org/3/search/movie?query=return&include_adult=false&language=en-US&page=1&api_key=67794c82b9038fd6aca2a93ec32186a6';

// console.log('test');

// class MovieDBService {
//   _SEARCH_WORD = 'return';
//   _API_KEY = '67794c82b9038fd6aca2a93ec32186a6';

//   // _GLOBAL_URL = `https://api.themoviedb.org/3/search/movie?query=${this._SEARCH_WORD}&include_adult=false&language=en-US&page=1&api_key=${this._API_KEY}`;

//   async getResource(url) {
//     const res = await fetch(url); // возвращает Promise
//     if (!res.ok) {
//       throw new Error(`Could not fetch ${url}, received ${res.ststus}`);
//     }
//     return await res.json();
//   }

//   async getMovies(searchWord) {
//     const res = await this.getResource(
//       `https://api.themoviedb.org/3/search/movie?query=${searchWord}&include_adult=false&language=en-US&page=1&api_key=${this._API_KEY}`
//     );
//     return res.results;
//   }
// }

// const mapi = new MovieDBService();

// mapi.getMovies('matrix').then(
//   (body) => body.forEach((movie) => console.log(movie.title, movie.release_date))
//   // body.forEach((movie) => console.log(movie.title));
// );
