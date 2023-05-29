import React, { Component } from 'react';
import { format } from 'date-fns';
// import MapiService from '../../services/mapi-service';
import { Rate } from 'antd';

import './Card.css';
// import image from './card.jpg';

export default class Card extends Component {
  // mapiService = new MapiService();

  constructor() {
    super();
  }

  render() {
    const {
      title,
      vote_average: voteAverage,
      release_date: releaseDate,
      overview,
      poster_path: posterPath,
    } = this.props.movieInfo;

    const index = this.props.cardIndex;

    // console.log(voteAverage);

    let rateColor = 'card__rate';

    if (voteAverage >= 3) {
      rateColor += ' card__rate--above3';
    }
    if (voteAverage >= 5) {
      rateColor += ' card__rate--above5';
    }
    if (voteAverage >= 7) {
      rateColor += ' card__rate--above7';
    }

    return (
      <div className="card">
        <img className="card__image" src={`https://image.tmdb.org/t/p/w500/${posterPath}`} alt={`${title}'s poster`} />
        <div className="card__content">
          <div className="card__title-box">
            <h2 className="card__title">{title}</h2>
            <div className={rateColor}>{voteAverage.toFixed(1)}</div>
          </div>
          <span className="card__date">{releaseDate ? format(new Date(releaseDate), 'MMMM dd, yyyy') : ''} </span>
          <div className="card__lables">
            <span className="card__label">Action</span>
            <span className="card__label">Drama</span>
          </div>
          <p style={{ height: this.props.heightsArray[index] + 'px' }} className="card__text">
            {overview}
          </p>
          <Rate
            className="card__rate-stars"
            style={{
              fontSize: 18,
            }}
            allowHalf
            count={10}
          />
        </div>
      </div>
    );
  }
}
