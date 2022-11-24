import { StarBorder } from "@mui/icons-material";
import React from "react";
import { useQuery } from "react-query";
import { getTopPeople } from "../../api/people";
import { queriesKeys } from "../../api/queriesKeys";
import { CarouselResults } from "../general/CarouselResults";
import { SmallList } from "../general/SmallList";
import { OnePerson, placeholderPerson } from "./OnePerson";

export const TopPeople = () => {
  const { data, isLoading, isError } = useQuery(
    queriesKeys.getTopPeople,
    () => getTopPeople(),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <CarouselResults
      data={data?.data}
      isLoading={isLoading}
      title="Top Cast/Crew"
      width={"100%"}
      // maxWidth="900px"
      oneResultComponent={<OnePerson {...placeholderPerson} />}
      isSmallList
    />
  );
};
