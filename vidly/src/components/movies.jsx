import React, { Component } from "react";
import MoviesTable from "./moviesTable";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/listgroup";
import { getMovies, deleteMovie } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    selectedGenre: {},
    sortColumn: { path: "title", order: "asc" },
    searchString: ""
  };

  componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];

    this.setState({
      movies: getMovies(),
      selectedGenre: { _id: "", name: "All Genres" },
      genres
    });
  }

  handleDelete = movie => {
    const deleted = deleteMovie(movie._id);
    console.log(deleted);
    this.props.history.push("/movies");
    // let moviesNew = this.state.movies.filter(m => m._id !== movie._id);
    // this.setState({ movies: moviesNew });
  };

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movie };
    movies[index].liked = !movie.liked;
    this.setState({ movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchString: "", currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleNewMovie = () => {
    this.props.history.push("/movies/new");
  };

  handleSearch = ({ currentTarget }) => {
    const searchString = currentTarget.value;
    this.setState({
      searchString,
      selectedGenre: { _id: "", name: "All Genres" },
      currentPage: 1
    });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      movies: allMovies,
      selectedGenre,
      searchString
    } = this.state;

    const regExp = new RegExp(searchString, "i");
    const searchedMovies =
      allMovies.filter(({ title }) => title.match(regExp)) || [];

    const filtered =
      selectedGenre && selectedGenre._id
        ? searchedMovies.filter(m => m.genre._id === selectedGenre._id)
        : searchedMovies;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, movies: movies };
  };

  render() {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      movies: allMovies,
      genres,
      searchString
    } = this.state;

    let { length: count } = allMovies;
    if (count === 0) return <p>There are no movies in the database.</p>;

    const { totalCount, movies } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={genres}
            selectedItem={selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <button onClick={this.handleNewMovie} className="btn btn-primary m-2">
            New Movie
          </button>
          {selectedGenre ? (
            <p>Showing {totalCount} movies in the database.</p>
          ) : (
            <p>Showing {totalCount} movies for this genre.</p>
          )}
          <input
            value={searchString}
            onChange={this.handleSearch}
            placeholder=" Search..."
          />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
