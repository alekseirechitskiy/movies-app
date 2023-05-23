import { React, Component } from 'react';
import { Pagination } from 'antd';

import MapiService from '../../services/mapiService.js';

import './PaginationComponent.css';

export default class PaginationComponent extends Component {
  mapiService = new MapiService();

  render() {
    const { totalResults, currentPage, onPageChange } = this.props;

    if (totalResults === 0) {
      return null;
    }

    return (
      <Pagination
        className="pagination-component"
        total={totalResults}
        current={currentPage}
        onChange={onPageChange}
        defaultPageSize={20}
      />
    );
  }
}
