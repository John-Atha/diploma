interface GenreProps {
  id: number;
  name: string;
  movies_count: number;
}
export class Genre {
  id: number;
  name: string;
  movies_count: number;

  constructor({ id, name, movies_count }: GenreProps) {
    this.id = id;
    this.name = name;
    this.movies_count = movies_count;
  }

  getExtraFields() {
    return ["movies_count"];
  }
}
