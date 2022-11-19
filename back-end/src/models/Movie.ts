import { Genre } from "./Genre";
import { Language } from "./Language";
import { ProductionCompany } from "./ProductionCompany";
import { ProductionCountry } from "./ProductionCountry";

export interface MovieBrief {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  homepage: string;

  genres: Genre[];
  ratings_count: number;
  ratings_average: number;
}

export interface Movie extends MovieBrief {
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
