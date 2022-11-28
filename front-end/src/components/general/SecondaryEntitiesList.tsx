import React, { cloneElement, ReactElement, useEffect, useState } from "react";
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
import { CardOverlay, placeholderCardOverlay } from "./CardOverlay";

interface SecondaryEntitiesListProps {
  name: string;
  component: ReactElement;
  keyField: string;
}

export const SecondaryEntitiesList = ({
  name,
  component,
  keyField,
}: SecondaryEntitiesListProps) => {
  const [page, setPage] = useState(1);
  const [all, setAll] = useState<any>([]);
  const [noMore, setNoMore] = useState(false);

  const { data, isLoading } = useQuery(
    [queriesKeys.getEntities(name), page, name],
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
    if (data?.data) {
      const newData = data.data.map((datum: any) => ({
        ...datum,
        href: `/${name}/${datum[keyField]}`,
      }));
      setAll(all.concat([...newData]));
    }
    setNoMore(data?.data.length < pagiStep);
  }, [data]);

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
        oneComponent={cloneElement(component)}
      />
    </Stack>
  );
};
