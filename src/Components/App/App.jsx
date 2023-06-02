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

  state = {
    text: '',
    currentPage: '',
    currentTabKey: 'search',
    totalPages: null,
    totalResults: null,
    tempResultsArray: [],
    resultsArray: [],
    loading: false,
    error: false,
    sessionId: '',
    ratedArray: [],

    // ratedArray: [
    //   {
    //     rating: 9,
    //     adult: false,
    //     backdrop_path: '/c4L5nFbs72Cfe4Q4hF0T99USa1I.jpg',
    //     genre_ids: [16, 878, 28, 18],
    //     id: 15137,
    //     original_language: 'ja',
    //     original_title: 'ヱヴァンゲリヲン新劇場版：序',
    //     overview:
    //       'After the Second Impact, Tokyo-3 is being attacked by giant monsters called Angels that seek to eradicate humankind. The child Shinji\'s objective is to fight the Angels by piloting one of the mysterious Evangelion mecha units. A remake of the first six episodes of GAINAX\'s famous 1996 anime series. The film was retitled "Evangelion: 1.01" for its home video version and "Evangelion: 1.11" for a release with additional scenes.',
    //     popularity: 23.18,
    //     poster_path: '/pETU4GurpeEjBOM8oytMH0yNBHx.jpg',
    //     release_date: '2007-09-01',
    //     title: 'Evangelion: 1.0 You Are (Not) Alone',
    //     video: false,
    //     vote_average: 7.645,
    //     vote_count: 789,
    //   },
    //   {
    //     rating: 8,
    //     adult: false,
    //     backdrop_path: '/l7zvYpzBHgUYcAMZRNIkJS8ZkDC.jpg',
    //     genre_ids: [16, 878, 28, 18],
    //     id: 22843,
    //     original_language: 'ja',
    //     original_title: 'ヱヴァンゲリヲン新劇場版：破',
    //     overview:
    //       'Under constant attack by monstrous creatures called Angels that seek to eradicate humankind, U.N. Special Agency NERV introduces two new EVA pilots to help defend the city of Tokyo-3: the mysterious Makinami Mari Illustrous and the intense Asuka Langley Shikinami. Meanwhile, Gendo Ikari and SEELE proceed with a secret project that involves both Rei and Shinji.',
    //     popularity: 22.41,
    //     poster_path: '/7VLYN2CfJpB6PrcuzDKKqdGSUi6.jpg',
    //     release_date: '2009-06-26',
    //     title: 'Evangelion: 2.0 You Can (Not) Advance',
    //     video: false,
    //     vote_average: 7.843,
    //     vote_count: 725,
    //   },
    // ],
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.mapiService
      .getGenres()
      .then((res) => (this.genresArray = res))
      .catch(this.onError);
    this.mapiService
      .createGuestSession()
      .then((res) => {
        this.setState({ sessionId: res });
      })
      .catch(this.onError);

    this.setState({ loading: false, error: false });
    // this.defineRenderArray();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.text !== prevState.text) {
      this.getData(this.state.text, this.state.currentPage);
    }

    if (this.state.tempResultsArray !== prevState.tempResultsArray) {
      // this.defineRenderArray();
    }
    if (this.state.currentTabKey !== prevState.currentTabKey) {
      this.mapiService.getRatedMovies(this.state.sessionId).then(this.onUpdateListWithRatings).catch(this.onError);
    }

    if (this.state.sessionId) {
      this.mapiService.getRatedMovies(this.state.sessionId).then((res) => {
        console.log(res);
      });
    }

    console.log('STATE', this.state);
    // console.log('RESULTS ARRAY ', this.state.resultsArray);
    // console.log('RATED ARRAY ', this.state.ratedArray);
  }

  onSearchChange = (e) => {
    if (e.target.value[0] === ' ') return;
    this.setState({ text: e.target.value });
  };

  defineRenderArray = () => {
    // clear resultsArray
    this.setState(({ resultsArray }) => {
      let newResultsArray = [...resultsArray];
      newResultsArray = [];
      // newResultsArray = [...this.state.tempResultsArray];
      return { resultsArray: newResultsArray };
    });

    // creating resultsArray from tempResultsArray
    this.state.tempResultsArray.forEach((item) => {
      this.setState(({ resultsArray }) => {
        let newArray = [...resultsArray];
        this.state.ratedArray.forEach((el) => {
          if (el.id === item.id) {
            item.rating = el.rating;
            console.log('item from TEMP ARRAY: ', item);
            // this.state.resultsArray.push(item);
            this.setState(({ resultsArray }) => {
              newArray = [...resultsArray];
              newArray.push(item);
              // return { resultsArray: newArray };
            });
          }
        });

        newArray.push(item);
        return { resultsArray: newArray };
      });
    });

    // clear tempResultsArray
    this.setState(({ tempResultsArray }) => {
      let newTempResultsArray = [...tempResultsArray];
      newTempResultsArray = [];
      return { tempResultsArray: newTempResultsArray };
    });
  };

  getData = debounce((title) => {
    // const title = 'matrix';
    this.setState({
      loading: true,
    });

    // this.mapiService.getMovies(title).then(this.onUpdateList).catch(this.onError);
    this.mapiService.getMovies(title).then(this.onUpdateList).catch(this.onError);

    // evangelion

    this.mapiService.getRatedMovies(this.state.sessionId).then(this.onUpdateListWithRatings).catch(this.onError);
  }, 500);

  onUpdateList = (data) => {
    console.log('== DATA ==', data.results);
    // console.log(this.state.ratedArray);
    let tempData = data.results;
    let newTempData = [];
    tempData.forEach((el) => {
      this.state.ratedArray.forEach((item) => {
        if (el.id === item.id) {
          el.rating = item.rating;
          console.log(el.rating);

          const idx = tempData.findIndex((el) => el.id === item.id);
          const oldItem = tempData[idx];
          const newItem = { ...oldItem };

          tempData = [...tempData.slice(0, idx), newItem, ...tempData.slice(idx + 1)];
        }
      });

      newTempData.push(el);
    });

    return this.setState({
      currentPage: data.page,
      resultsArray: newTempData,
      // tempResultsArray: data.results,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      loading: false,
    });
  };
  // onUpdateList = (data) => {
  //   return this.setState({
  //     currentPage: data.page,
  //     // resultsArray: data.results,
  //     tempResultsArray: data.results,
  //     totalPages: data.total_pages,
  //     totalResults: data.total_results,
  //     loading: false,
  //   });
  // };

  onUpdateListWithRatings = (data) => {
    return this.setState({
      ratedArray: data,
    });
  };

  onError = () => {
    this.setState({ error: true, loading: false });
  };

  onChangePage = (page) => {
    this.setState({ currentPage: page, loading: true });
    this.mapiService.getMovies(this.state.text, page).then(this.onUpdateList).catch(this.onError);
    // this.defineRenderArray();
  };

  changeCurrentTabKey = (key) => {
    this.setState({
      currentTabKey: key,
      loading: true,
    });
    this.mapiService.getMovies(this.state.text, this.state.page).then(this.onUpdateList).catch(this.onError);
    // this.defineRenderArray();
  };

  setRate = (value, id, obj) => {
    // console.log('value, id: ', value, id, this.state.sessionId);
    console.log('star pressed');
    // this.defineRenderArray();

    this.mapiService.addRating(id, this.state.sessionId, value);
    this.setState(({ ratedArray }) => {
      const newArray = [...ratedArray];

      // Checking for already existing record
      const idx = newArray.findIndex((el) => el.id === id);
      if (idx !== -1) {
        const oldItem = newArray[idx];
        const newItem = { ...oldItem, rating: value };

        const editedArray = [...newArray.slice(0, idx), newItem, ...newArray.slice(idx + 1)];
        return {
          ratedArray: editedArray,
        };
      }

      const newRecord = this.createRateRecord(value, obj);
      newArray.push(newRecord);

      return {
        ratedArray: newArray,
      };
    });
  };

  createRateRecord = (rate, obj) => {
    const movieInfo = JSON.parse(JSON.stringify(obj));
    const record = { ...movieInfo, rating: rate, sessionId: this.state.sessionId };
    return record;
  };

  displayRatedList = () => {
    if (this.state.currentTabKey === 'rated') console.log(this.props.ratedArray);
  };

  render() {
    // console.log('=== STATE ===', this.state);
    const { ratedArray, resultsArray, loading, error } = this.state;

    const hasData = !(loading || error);

    const searchBar =
      this.state.currentTabKey === 'search' ? (
        <Search onSearchChange={this.onSearchChange} inputValue={this.state.text} />
      ) : null;

    const errorMessage = error ? <ErrorMessage /> : null;

    const spinner = loading ? <Spinner /> : null;
    let content;

    const noContent = loading ? null : 'Movie not found';

    if (hasData && this.state.currentTabKey === 'search') {
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

    if (hasData && this.state.currentTabKey === 'rated') {
      content = <List data={ratedArray} setRate={this.setRate} />;
    }

    return (
      <MovieProvider value={this.genresArray}>
        <div className="container">
          <Offline>
            <Alert message="Error" description="There is no connection to the internet!" type="error" showIcon />
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
            {resultsArray.length === 0 ? noContent : content}
          </Online>
        </div>
      </MovieProvider>
    );
  }
}
