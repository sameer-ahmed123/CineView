const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export interface genres {
  id: number;
  name: string;
}

export interface languages {
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
  runtime: number;
  homepage: string;
  tagline: string;
  genres: genres[];
  languages: languages[];
  original_language: string;
  adult: boolean;
}

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
};

export const fetchMovieById = async (id: string): Promise<Movie> => {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  return await res.json();
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&include_adult=false`
  );
  const data = await res.json();
  const nsfwKeywords = [
    "pussy",
    "rubbing",
    "sex",
    "ass",
    "nude",
    "nudity",
    "hentai",
    "softcore",
    "xxx",
    "fetish",
    "mistress",
    "incest",
    "porno",
    "adult",
    "淫",
    "乳",
    "裸",
    "淫乱",
    "人妻",
  ];

  console.log(data.results);
  const filteredResults = data.results.filter((movie: Movie) => {
    const text = `${movie.title} ${movie.overview} `.toLocaleLowerCase();
    return (
      !movie.adult && !nsfwKeywords.some((keyword) => text.includes(keyword))
    );
  });
  console.log(filteredResults);

  return filteredResults;
  // return data.results;
};

export const fetchMovieVideos = async (movieId: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results; // array of videos
};
