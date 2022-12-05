export interface PersonProps {
  id: number;
  name: string;
  gender: number;
  profile_path?: string;
  movies_count: number;
}

export class Person {
  id: number;
  name: string;
  gender: number;
  profile_path?: string;
  movies_count: number;

  constructor({ id, name, gender, profile_path, movies_count }: PersonProps) {
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.profile_path = profile_path;
    this.movies_count = movies_count;
  }

  getExtraFields() {
    return ["movies_count"];
  }
}
