import React, { Component } from 'react';
import { format } from 'date-fns';

// import MapiService from '../../services/mapi-service';

import './card.css';
// import image from './card.jpg';

export default class Card extends Component {
  // mapiService = new MapiService();

  // state = {
  //   title: null,
  //   releaseDate: null,
  //   posterPath: null,
  //   overview: null,
  // };

  constructor() {
    super();
  }

  checkTextHeight() {
    const textBlock = document.querySelector('.card__text');
    console.dir(textBlock);
  }

  render() {
    const { title, release_date: releaseDate, overview, poster_path: posterPath } = this.props.movieInfo;
    // console.log(this.props.movieInfo.id, this.props.movieInfo.poster_path);

    return (
      <div className="card">
        <img className="card__image" src={`https://image.tmdb.org/t/p/w500/${posterPath}`} alt={`${title}'s poster`} />
        <div className="card__content">
          <h2 className="card__title">{title}</h2>
          <span className="card__date">{releaseDate ? format(new Date(releaseDate), 'MMMM dd, yyyy') : ''} </span>
          <div className="card__lables">
            <span className="card__label">Action</span>
            <span className="card__label">Drama</span>
          </div>
          <p className="card__text">{overview}</p>
        </div>
      </div>
    );
  }
}
