import React, { Component } from 'react';
// import { Col, Row } from 'antd';

import Card from '../card';

import './list.css';

export default class List extends Component {
  renderListItem(listItem) {
    return (
      <li key={listItem.id}>
        <Card movieInfo={listItem} />
      </li>
    );
  }

  checkTextHeight() {
    const textBlock = document.querySelector('.card__text');
    console.log(textBlock);
  }

  render() {
    const { data } = this.props;

    const movieCard = data.map((el) => this.renderListItem(el));

    return <ul className="list">{movieCard}</ul>;
  }
}
