import { React, Component } from 'react';
import { Input } from 'antd';

import './Search.css';

export default class Search extends Component {
  render() {
    const { onSearchChange } = this.props;
    return (
      <div className="search">
        <Input className="search__input" onChange={onSearchChange} size="large" placeholder="Type to search..." />
        {/* <Input className="search__input" value={this.state.text} onChange={this.onTextCange} /> */}
      </div>
    );
  }
}
