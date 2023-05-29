import React, { Component } from 'react';

// import { Col, Row } from 'antd';

import Card from '../Card';
import './List.css';

export default class List extends Component {
  textColor = 'violet';

  state = {
    heightsArray: [],
  };

  renderListItem(listItem, itemIndex) {
    return (
      <li key={listItem.id}>
        <Card movieInfo={listItem} heightsArray={this.checkTextHeight()} cardIndex={itemIndex} />
      </li>
    );
  }

  checkTextHeight() {
    const cards = document.querySelectorAll('.card');
    const cardsArray = Array.from(cards);
    const heightsArray = cardsArray.map((card) => {
      const titleHight = card.querySelector('.card__title').offsetHeight + 7;
      const dateHight = card.querySelector('.card__date').offsetHeight + 9;
      const lablesHight = card.querySelector('.card__lables').offsetHeight + 9;
      const countedTextHight = 260 - (titleHight + dateHight + lablesHight);

      return countedTextHight;
    });

    return heightsArray;
  }

  componentDidMount() {
    this.setState({ heightsArray: this.checkTextHeight });
  }

  render() {
    const { data } = this.props;
    console.log('this.props: ', this.props);

    const movieCard = data.map((el, idx) => this.renderListItem(el, idx));

    return <ul className="list">{movieCard}</ul>;
  }
}
