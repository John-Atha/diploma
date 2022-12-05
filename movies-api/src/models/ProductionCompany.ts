export interface ProductionCompanyProps {
  id: number;
  name: string;
  movies_count: number;
}

export class ProductionCompany {
  id: number;
  name: string;
  movies_count: number;

  constructor({ id, name, movies_count }: ProductionCompanyProps) {
    this.id = id;
    this.name = name;
    this.movies_count = movies_count;
  }

  getExtraFields() {
    return ["movies_count"];
  }
}
