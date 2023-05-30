import React, { Component } from 'react';
import { format } from 'date-fns';
import { Rate } from 'antd';

// import MapiService from '../../services/mapiService';
import { MovieConsumer } from '../../Context';
import './Card.css';
// import image from './card.jpg';

export default class Card extends Component {
  constructor() {
    super();
  }

  renderGenerLabel = (listItem, itemIndex) => {
    return (
      <span key={itemIndex} className="card__label">
        {listItem}
      </span>
    );
  };

  defineGenre = () => {};

  // getGenresName = (genresIds, arrGenresObj) => {
  //   if (!genresIds) {
  //     return;
  //   }
  //   const names = genresIds.map((id) => arrGenresObj.find((obj) => obj.id === id)).filter((obj) => obj !== undefined);

  //   console.log('names: ', names);
  //   return names;
  // };

  render() {
    // console.log('GENRES IN CARD: ', this.state.genresArray);

    const {
      title,
      vote_average: voteAverage,
      release_date: releaseDate,
      genre_ids: genreIds,
      overview,
      poster_path: posterPath,
      id,
    } = this.props.movieInfo;

    const index = this.props.cardIndex;
    const star = this.props.star;

    // const genreLabel = genreIds.map((el, idx) => this.renderGenerLabel(el, idx));

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
          <ul className="card__labels">
            <MovieConsumer>
              {(genreLabel) => {
                return genreIds.map((el, idx) => (
                  <span key={idx} className="card__label">
                    {genreLabel.map((item) => {
                      console.log('item: ', item.id);
                      if (item.id === el) return item.name;
                    })}
                  </span>
                ));
                // return <span className="card__label">{genreIds}</span>;
              }}
            </MovieConsumer>
          </ul>
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
            onChange={(value) => star(value, id, this.props.movieInfo)}
          />
        </div>
      </div>
    );
  }
}

{
  /* <MovieConsumer>
  {() => {
    return genreIds.map((el) => (
      <span key={id} className="card__label">
        {el}
      </span>
    ));
    // return <span className="card__label">{genreIds}</span>;
  }}
</MovieConsumer>; */
}

{
  /* {genreLabel} */
}
{
  /* {genreIds.map((el, idx) => (
              <span key={idx} className="card__label">
                {el}
              </span>
            ))} */
}
{
  /* <span className="card__label">Action</span>
            <span className="card__label">Drama</span> */
}
