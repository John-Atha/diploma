import { Genre } from "./Genre";
import { Language } from "./Language";
import { ProductionCompany } from "./ProductionCompany";
import { ProductionCountry } from "./ProductionCountry";

export interface MovieBriefProps {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  homepage: string;

  genres: Genre[];
  ratings_count: number;
  ratings_average: number;
}

export class MovieBrief {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  homepage: string;

  genres: Genre[];
  ratings_count: number;
  ratings_average: number;

  constructor(movie: MovieBriefProps) {
    this.id = movie.id;
    this.title = movie.title;
    this.poster_path = movie.poster_path;
    this.release_date = movie.release_date;
    this.homepage = movie.homepage;
    this.genres = [];
    this.ratings_count = 0;
    this.ratings_average = 0;
  }
}

export interface MovieProps extends MovieBriefProps {
  overview: string;
  popularity: number;
  tagline: string;
  vote_average: number;
  vote_count: number;
  status: string;
  adult: string;
  budget: number;
  imdb_id: string;

  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: Language[];
}
