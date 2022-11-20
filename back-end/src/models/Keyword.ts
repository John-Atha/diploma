export interface KeywordProps {
  id: number;
  name: string;
  movies_count: number;
}

export class Keyword {
  id: number;
  name: string;
  movies_count: number;

  constructor({ id, name, movies_count }: KeywordProps) {
    this.id = id;
    this.name = name;
    this.movies_count = movies_count;
  }

  getExtraFields() {
    const fields = [];
    fields.push("movies_count");
    return fields;
  }
}
