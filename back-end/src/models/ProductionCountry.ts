export interface ProductionCountryProps {
  iso_3166_1: string;
  name: string;
  movies_count: number;
}

export class ProductionCountry {
  iso_3166_1: string;
  name: string;
  movies_count: number;

  constructor({ iso_3166_1, name, movies_count }: ProductionCountryProps) {
    this.iso_3166_1 = iso_3166_1;
    this.name = name;
    this.movies_count = movies_count;
  }

  getExtraFields() {
    return ["movies_count"];
  }
}
