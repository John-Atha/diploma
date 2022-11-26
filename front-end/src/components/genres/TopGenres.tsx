import { StarBorder } from "@mui/icons-material";
import React from "react";
import { useQuery } from "react-query";
import { getTopGenres } from "../../api/genres";
import { queriesKeys } from "../../api/queriesKeys";
import { CarouselResults } from "../general/CarouselResults";
import {
  OneSecondaryEntity,
  placeholderSecondaryEntity,
} from "../general/OneSecondaryEntity";
import { SmallList } from "../general/SmallList";
import { OneSecondaryEntityRow } from "../general/OneGenreRow";

export const TopGenres = () => {
  const { data, isLoading } = useQuery(
    queriesKeys["getTopGenres"],
    () => getTopGenres(),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <SmallList
      data={data?.data}
      isLoading={isLoading}
      title="Top Genres"
      href="/genres"
      icon={<StarBorder />}
      oneElement={
        <OneSecondaryEntityRow
          {...placeholderSecondaryEntity}
          entityName="genres"
          width="auto"
        />
      }
    />
  );
};
