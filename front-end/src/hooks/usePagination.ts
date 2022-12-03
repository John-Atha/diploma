import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { pagiStep } from "../api/config";
import { getRequest } from "../api/helpers";

interface UsePaginationProps {
  name: string;
  keyField: string;
  sort_by_options?: string[];
  queryFnFirstKey: string;
  requestUrl: string;
}

interface QueryConfig {
  name: string;
  sort_by?: string;
  order?: "desc" | "asc";
  page: number;
}

export const usePagination = ({
  name,
  keyField,
  sort_by_options,
  queryFnFirstKey,
  requestUrl,
}: UsePaginationProps) => {
  const [all, setAll] = useState<any>([]);
  const [noMore, setNoMore] = useState(false);

  const [queryConfig, setQueryConfig] = useState<QueryConfig>({
    name,
    sort_by: sort_by_options?.[0],
    order: undefined,
    page: 1,
  });

  const { data, isLoading } = useQuery(
    [queryFnFirstKey, queryConfig],
    () =>
      getRequest({
        requestUrl,
        params: {
          ...queryConfig,
        },
      }),
    {
      enabled: Boolean(name),
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  const setPage = (page: number) => {
    console.log("setting page:", page);

    setQueryConfig({
      ...queryConfig,
      page,
    });
  };

  const resetQuery = () => {
    console.log("resetting query");
    setQueryConfig({
      ...queryConfig,
      page: 1,
    });
  };

  const onNextPage = () => setPage(queryConfig.page + 1);
  const onPreviousPage = () => setPage(queryConfig.page - 1);

  useEffect(() => {
    console.log("sort_by_options changed to:", sort_by_options);
    if (sort_by_options?.length) {
      setQueryConfig({
        ...queryConfig,
        sort_by: sort_by_options[0],
      });
    }
  }, [JSON.stringify(sort_by_options)]);

  useEffect(() => {
    resetQuery();
  }, [name, queryConfig.sort_by, queryConfig.order]);

  useEffect(() => {
    if (data?.data) {
      const newData = data.data.map((datum: any) => ({
        ...datum,
        href: `/${name}/${datum[keyField]}`,
      }));
      if (queryConfig.page === 1) setAll(newData);
      else setAll(all.concat([...newData]));
    }
    setNoMore(data?.data.length < pagiStep);
  }, [data]);

  return {
    noMore,
    all,
    isLoading,
    onNextPage,
    onPreviousPage,
    resetQuery,
  };
};
