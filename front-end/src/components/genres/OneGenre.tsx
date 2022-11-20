import React from "react";
import { OneSecondaryEntity } from "../general/SecondaryEntityCard";

export const placeholderGenre = {
  id: 0,
  name: "",
  movies_count: 0,
};

export interface GenreProps {
  id: number;
  name: string;
  movies_count: number;
}
export const OneGenre = ({ id, name, movies_count }: GenreProps) => {
  return (
    <OneSecondaryEntity
      id={id}
      name={name}
      movies_count={movies_count}
      href={`/genres/${id}`}
      height={150}
      width={"100%"}
    />
  );
};
