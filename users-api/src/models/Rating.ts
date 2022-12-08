import { MovieBrief } from "./Movie";
import { User } from "./User";

export interface RatingProps {
  user: User;
  movie: MovieBrief;
  rating: number;
  rating_datetime: Date;
}

export class Rating {
  user: User;
  movie: MovieBrief;
  rating: number;
  rating_datetime: Date;

  constructor({ user, movie, rating, rating_datetime }: RatingProps) {
    this.user = user;
    this.movie = movie;
    this.rating = rating;
    this.rating_datetime = rating_datetime;
  }
}
