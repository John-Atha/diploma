import React, { ReactElement, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { queriesKeys } from "../../api/queriesKeys";
import { pagiStep } from "../../api/config";
import { Results } from "../general/Results";
import { getEntities } from "../../api/general";
import {
  OneSecondaryEntity,
  placeholderSecondaryEntity,
} from "./OneSecondaryEntity";
import { Stack, Typography } from "@mui/material";

interface SecondaryEntitiesListProps {
  name: string;
  component: ReactElement;
}

export const SecondaryEntitiesList = ({ name }: SecondaryEntitiesListProps) => {
  const [page, setPage] = useState(1);
  const [all, setAll] = useState<any>([]);
  const [noMore, setNoMore] = useState(false);

  const { data, isLoading } = useQuery(
    [queriesKeys.getEntities(name), page],
    () => getEntities({ name, page }),
    {
      enabled: Boolean(name),
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    setPage(1);
  }, [name]);

  useEffect(() => {
    if (data?.data) setAll(all.concat([...data.data]));
    setNoMore(data?.data.length < pagiStep);
  }, [data]);

  console.log({ all });

  return (
    <Stack spacing={1}>
      <Typography variant="h6" sx={{ paddingLeft: "18px !important" }}>
        All {name}
      </Typography>
      <Results
        data={all}
        isLoading={isLoading}
        noMore={noMore}
        onNextPage={() => setPage(page + 1)}
        keyword="data"
        oneComponent={<OneSecondaryEntity {...placeholderSecondaryEntity} />}
      />
    </Stack>
  );
};
