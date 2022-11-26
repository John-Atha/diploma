import { StarBorder } from "@mui/icons-material";
import React from "react";
import { useQuery } from "react-query";
import { getTopGenres } from "../../api/genres";
import { getTopKeywords } from "../../api/keywords";
import { queriesKeys } from "../../api/queriesKeys";
import { CarouselResults } from "../general/CarouselResults";
import { OneSecondaryEntityRow } from "../general/OneGenreRow";
import {
  OneSecondaryEntity,
  placeholderSecondaryEntity,
} from "../general/OneSecondaryEntity";
import { SmallList } from "../general/SmallList";

export const TopKeywords = () => {
  const { data, isLoading } = useQuery(
    queriesKeys["getTopKeywords"],
    () => getTopKeywords(),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <SmallList
      data={data?.data}
      isLoading={isLoading}
      title="Top Keywords"
      icon={<StarBorder />}
      href="/keywords"
      oneElement={
        <OneSecondaryEntityRow
          {...placeholderSecondaryEntity}
          entityName="keywords"
          width="auto"
        />
      }
    />
  );
};
