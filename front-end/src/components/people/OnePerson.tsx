import { Person } from "@mui/icons-material";
import React from "react";
import {
  tmdb_base_url,
  tmdb_base_url_width_200,
} from "../../data/cloud_base_urls";
import { CardOverlay } from "../general/CardOverlay";

interface OnePersonProps {
  id: number;
  name: string;
  gender: number;
  profile_path: string;
  movies_count: number;
  character?: string;
  department?: string;
  job?: string;
}

export const placeholderPerson: OnePersonProps = {
  id: 0,
  name: "A",
  gender: 0,
  profile_path: "",
  movies_count: 0,
};

export const OnePerson = ({
  id,
  name,
  gender,
  profile_path,
  movies_count,
  character,
  department,
  job,
}: OnePersonProps) => {
  const logo = profile_path ? `${tmdb_base_url}${profile_path}` : "";
  const subtitle = department
    ? `${department} - ${job}`
    : character
    ? `Character: ${character}`
    : movies_count
    ? `${movies_count} Movies`
    : "";
  return (
    <CardOverlay
      src={logo}
      fallbackImg={<Person />}
      title={name}
      subtitle={subtitle}
      href={`/people/${id}`}
      width={100}
      height={200}
    />
  );
};
