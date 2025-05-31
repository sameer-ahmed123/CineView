const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export interface Genre {
  id: number;
  name: string;
}

export interface language {
  english_name: string;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  runtime?: number;
  homepage?: string;
  tagline?: string;
  genres?: Genre[];
  genre_ids:number[];
  languages: language[];
  original_language: string;
  adult: boolean;
}

// Add a new interface for the API response structure
export interface MovieApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface GenreListResponse {
  genres: Genre[];
}

export const fetchPopularMovies = async (
  page = 1
): Promise<MovieApiResponse> => {
  // Changed return type
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  const data: MovieApiResponse = await res.json();
  return data;
};

export const fetchMovieById = async (id: string): Promise<Movie> => {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  return await res.json();
};

export const searchMovies = async (
  query: string,
  page = 1
): Promise<MovieApiResponse> => {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}&include_adult=false`
  );
  const data: MovieApiResponse = await res.json();

  const nsfwKeywords = [
    "pussy"
  ];

  // console.log(data.results);
  const filteredResults = data.results.filter((movie: Movie) => {
    const text = `${movie.title} ${movie.overview} `.toLocaleLowerCase();
    return (
      !movie.adult && !nsfwKeywords.some((keyword) => text.includes(keyword))
    );
  });
  // console.log(filteredResults);

  return {
    ...data, // Include original page, total_pages, total_results
    results: filteredResults, // Override results with filtered ones
  };
};

export const fetchMovieVideos = async (movieId: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results; // array of videos
};

export const fetchMovieGenres = async (): Promise<Genre[]> => {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  const data: GenreListResponse = await res.json();
  return data.genres;
};

export const FetchMoviesByGenre = async (
  genreId: number,
  page = 1
): Promise<MovieApiResponse> => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc&include_adult=false`
  );
  const data: MovieApiResponse = await response.json();
  // return data;

  const nsfwKeywords = [
    "pussy"
  ];

  const filteredResults = data.results.filter((movie) => {
    const text = `${movie.title} ${movie.overview}`.toLocaleLowerCase();
    return (
      !movie.adult && !nsfwKeywords.some((keyword) => text.includes(keyword))
    );
  });

  return {
    ...data,
    results: filteredResults,
  };
};
