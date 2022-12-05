export interface LanguageProps {
  iso_639_1: string;
  name: string;
  movies_count: number;
}

export class Language {
  iso_639_1: string;
  name: string;
  movies_count: number;

  constructor({ iso_639_1, name, movies_count }: LanguageProps) {
    this.iso_639_1 = iso_639_1;
    this.name = name;
    this.movies_count = movies_count;
  }

  getExtraFields() {
    return ["movies_count"];
  }
}
