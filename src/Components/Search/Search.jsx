import { React, Component } from 'react';
import { AutoComplete } from 'antd';

import './Search.css';

export default class Search extends Component {
  render() {
    return (
      <div className="search">
        <AutoComplete className="search__input" size="large" placeholder="Type to search..." />
      </div>
    );
  }
}
