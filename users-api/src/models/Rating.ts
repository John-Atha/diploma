import { MovieBrief } from "./Movie";
import { User } from "./User";

export interface RatingProps {
  user: User;
  movie: MovieBrief;
  rating: number;
  datetime: Date;
}

export class Rating {
  user: User;
  movie: MovieBrief;
  rating: number;
  datetime: Date;

  constructor({ user, movie, rating, datetime }: RatingProps) {
    this.user = user;
    this.movie = movie;
    this.rating = rating;
    this.datetime = datetime;
  }
}
