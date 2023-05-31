import React, { Component } from 'react';

import PaginationComponent from '../PaginationComponent';
import Card from '../Card';
import './List.css';

export default class List extends Component {
  renderListItem(listItem) {
    return (
      <li key={listItem.id}>
        <Card movieInfo={listItem} setRate={this.props.setRate} />
      </li>
    );
  }

  render() {
    const { data, totalPages, currentTabKey, totalResults, currentPage, onPageChange } = this.props;

    const movieCard = data.map((el) => this.renderListItem(el));

    return (
      <>
        <ul className="list">{movieCard}</ul>
        {totalPages && currentTabKey === 'search' ? (
          <PaginationComponent
            pages={totalPages}
            currentPage={currentPage}
            totalResults={totalResults}
            onPageChange={onPageChange}
          />
        ) : null}
        {totalPages && currentTabKey === 'rated' ? (
          <PaginationComponent currentPage={1} onPageChange={onPageChange} />
        ) : null}
      </>
    );
  }
}
