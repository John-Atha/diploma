
export interface MovieBriefProps {
  id: number;
  title: string;
  original_title: string;
  poster_path: string;
  release_date: string;
  homepage: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  overview: string;

  ratings_count: number;
  ratings_average: number;
}

export class MovieBrief {
  id: number;
  title: string;
  original_title: string;
  poster_path: string;
  release_date: string;
  homepage: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  ratings_count: number;
  ratings_average: number;
  overview: string;

  constructor(movie: MovieBriefProps) {
    this.id = movie.id;
    this.title = movie.title;
    this.original_title = movie.original_title;
    this.poster_path = movie.poster_path;
    this.release_date = movie.release_date;
    this.homepage = movie.homepage;
    this.popularity = movie.popularity;
    this.vote_average = movie.vote_average;
    this.vote_count = movie.vote_count;
    this.overview = movie.overview;
    this.ratings_count = movie.ratings_count;
    this.ratings_average = movie.ratings_average;
  }
}
