import React, { Component } from 'react';
import { format } from 'date-fns';

// import MapiService from '../../services/mapi-service';

import './Card.css';
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

  // checkTextHeight() {
  //   // const textBlock = document.querySelector('.card__text');
  //   // console.dir(textBlock.textContent);
  //   // const textArray = textBlock.textContent.split(' ');
  //   // console.log('textArray: ', textArray);

  //   // textArray.length = textArray.length - 20;
  //   // console.log('NEWtextArray: ', textArray);

  //   // const newString = textArray.join(' ');
  //   // console.log('newString: ', newString);

  //   const titleHight = document.querySelector('.card__title').offsetHeight + 7;
  //   const dateHight = document.querySelector('.card__date').offsetHeight + 9;
  //   const lablesHight = document.querySelector('.card__lables').offsetHeight + 9;
  //   const countedTextHight = 260 - (titleHight + dateHight + lablesHight);

  //   const textHight = document.querySelector('.card__text');
  //   textHight.style.height = countedTextHight;

  //   console.log('countedTextHight: ', countedTextHight);
  //   console.log('sattTextHight: ', textHight.offsetHeight);
  //   // console.log(titleHight, '+', dateHight, '+', lablesHight);
  //   // console.log('titleHight: ', titleHight);
  //   // console.log('dateHight: ', dateHight);
  //   // console.log('lablesHight: ', lablesHight);
  // }

  // componentDidMount() {
  //   this.checkTextHeight();
  // }

  render() {
    console.log(this);
    const { title, release_date: releaseDate, overview, poster_path: posterPath } = this.props.movieInfo;
    const index = this.props.cardIndex;

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
          <p style={{ height: this.props.heightsArray[index] + 'px' }} className="card__text">
            {overview}
          </p>
        </div>
        <div></div>
      </div>
    );
  }
}
