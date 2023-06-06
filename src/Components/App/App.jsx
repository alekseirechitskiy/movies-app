import React, { Component } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Alert, Tabs } from 'antd';
import { debounce } from 'lodash';

import MapiService from '../../services/mapiService.js';
import Spinner from '../Spinner/index.js';
import List from '../List/index.js';
import ErrorMessage from '../ErrorMessage/index.js';
import Search from '../Search';
import { MovieProvider } from '../../Context';

import './App.css';

export default class App extends Component {
  mapiService = new MapiService();

  tabsItems = [
    {
      key: 'search',
      label: 'Search',
    },
    {
      key: 'rated',
      label: 'Rated',
    },
  ];

  genresArray = [];

  errorMessage = 'We are already trying to fix it. Please, try later.';

  state = {
    text: '',
    currentPage: '',
    currentTabKey: 'search',
    totalPages: null,
    totalResults: null,
    resultsArray: [],
    loading: false,
    error: false,
    sessionId: '',
    ratedArray: [],
    hasError: false,
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.mapiService
      .getGenres()
      .then((res) => (this.genresArray = res))
      .catch((error) => {
        console.error(error);
        this.setState({ hasError: true });
      });
    this.mapiService
      .createGuestSession()
      .then((res) => {
        this.setState({ sessionId: res });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ hasError: true });
      });

    this.setState({ loading: false, error: false });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.text !== prevState.text) {
      this.getData(this.state.text, this.state.currentPage);
    }

    if (this.state.currentTabKey !== prevState.currentTabKey) {
      this.getData(this.state.text, this.state.currentPage);
    }
  }

  componentDidCatch() {
    this.setRate({ hasError: true });
  }

  onSearchChange = (e) => {
    if (e.target.value[0] === ' ') return;
    this.setState({ text: e.target.value });
  };

  getData = debounce((title) => {
    this.setState({
      loading: true,
    });

    this.mapiService
      .getMovies(title)
      .then((resolve) => this.onUpdateList(resolve))
      .catch(this.onError);
  }, 500);

  onUpdateList = (data) => {
    let tempData = data.results;
    let tempRatedData = [];

    let newTempData = [];
    let newTempRatedData = [];
    let curPage = data.page;
    let totalPages = data.total_pages;
    let totalResults = data.total_results;

    tempData.forEach((item) => {
      newTempData.push(item);
    });

    this.mapiService
      .getRatedMovies(this.state.sessionId)
      .then((data) => {
        tempRatedData = data;

        tempRatedData.forEach((item) => {
          newTempRatedData.push(item);
        });

        newTempData.forEach((movie) => {
          newTempRatedData.forEach((ratedMovie) => {
            if (movie.id === ratedMovie.id) {
              const idx = newTempData.findIndex((movie) => movie.id === ratedMovie.id);
              const replaceItem = newTempData[idx];
              const newItem = { ...replaceItem, rating: ratedMovie.rating };

              newTempData = [...newTempData.slice(0, idx), newItem, ...newTempData.slice(idx + 1)];
            }
            return this.setState({
              currentPage: curPage,
              resultsArray: newTempData,
              ratedArray: newTempRatedData,
              totalPages: totalPages,
              totalResults: totalResults,
              loading: false,
            });
          });

          return this.setState({
            currentPage: curPage,
            resultsArray: newTempData,
            ratedArray: newTempRatedData,
            totalPages: totalPages,
            totalResults: totalResults,
            loading: false,
          });
        });

        return this.setState({
          currentPage: curPage,
          resultsArray: newTempData,
          ratedArray: newTempRatedData,
          totalPages: totalPages,
          totalResults: totalResults,
          loading: false,
        });
      })
      .catch(this.onError);
  };

  onError = () => {
    this.setState({ hasError: true, loading: false });
  };

  onChangePage = (page) => {
    this.setState({ currentPage: page, loading: true });
    this.mapiService.getMovies(this.state.text, page).then(this.onUpdateList).catch(this.onError);
  };

  changeCurrentTabKey = (key) => {
    this.setState({
      currentTabKey: key,
      loading: true,
    });
  };

  setRate = (value, id) => {
    this.mapiService.addRating(id, this.state.sessionId, value);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container">
          <Alert
            className="error"
            message="Something wrong has happened!"
            description={this.errorMessage}
            type="error"
            showIcon
          />
        </div>
      );
    }

    const { ratedArray, resultsArray, loading, error } = this.state;

    const hasData = !(loading || error);

    const searchBar =
      this.state.currentTabKey === 'search' ? (
        <Search onSearchChange={this.onSearchChange} inputValue={this.state.text} />
      ) : null;

    const errorMessage = error ? (
      <ErrorMessage message="Could not get data from server. Please try again in 5 minutes." />
    ) : null;

    const spinner = loading ? <Spinner /> : null;

    let content;

    const message = <span className="message">The movies list is empty</span>;
    const noContent = loading ? null : message;

    if (hasData && this.state.currentTabKey === 'search' && resultsArray.length !== 0) {
      content = (
        <List
          data={resultsArray}
          totalPages={this.state.totalPages}
          currentTabKey={this.state.currentTabKey}
          currentPage={this.state.currentPage}
          totalResults={this.state.totalResults}
          onPageChange={this.onChangePage}
          setRate={this.setRate}
          rated={this.state.ratedArray}
        />
      );
    }

    if (hasData && this.state.currentTabKey === 'rated' && ratedArray.length !== 0) {
      content = <List data={ratedArray} setRate={this.setRate} />;
    }
    return (
      <MovieProvider value={this.genresArray}>
        <div className="container">
          <Offline>
            <Alert
              className="error"
              message="Error"
              description="There is no connection to the internet!"
              type="error"
              showIcon
            />
          </Offline>
          <Online>
            <Tabs
              className=""
              destroyInactiveTabPane={true}
              centered
              size={'large'}
              onChange={this.changeCurrentTabKey}
              defaultActiveKey={this.state.currentTabKey}
              items={this.tabsItems}
            />
            {searchBar}
            {errorMessage}
            {spinner}
            {content ? content : noContent}
          </Online>
        </div>
      </MovieProvider>
    );
  }
}
