import { Person } from "@mui/icons-material";
import React from "react";
import { tmdb_base_url, tmdb_base_url_width_200 } from "../../data/cloud_base_urls";
import { CardOverlay } from "../general/CardOverlay";

interface OnePersonProps {
  id: number;
  name: string;
  gender: number;
  profile_path: string;
  movies_count: number;
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
}: OnePersonProps) => {
  const logo = profile_path ? `${tmdb_base_url}${profile_path}` : "";
  return (
    <CardOverlay
      src={logo}
      fallbackSrc={""}
      fallbackImg={<Person />}
      title={name}
      subtitle={`${movies_count} Movies`}
      href={`/people/${id}`}
      width={100}
      height={200}
    />
  );
};
