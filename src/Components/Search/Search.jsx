import { React, Component } from 'react';
import { Input } from 'antd';

import './Search.css';

export default class Search extends Component {
  render() {
    const { onSearchChange, inputValue } = this.props;
    return (
      <div className="search">
        <Input
          className="search__input"
          value={inputValue}
          onChange={onSearchChange}
          size="large"
          placeholder="Type to search..."
        />
      </div>
    );
  }
}
