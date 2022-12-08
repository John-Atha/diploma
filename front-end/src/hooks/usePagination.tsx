import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { pagiStep } from "../api/config";
import { getRequest } from "../api/helpers";
import { Pagination } from "../components/general/Pagination";

interface UsePaginationProps {
  name: string;
  keyField: string;
  sort_by_options: string[];
  queryFnFirstKey: string;
  requestUrl: string;
  datumTransform?: (t: any) => any;
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
  datumTransform = (t: any) => t,
}: UsePaginationProps) => {
  const [all, setAll] = useState<any>([]);
  const [noMore, setNoMore] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [queryConfig, setQueryConfig] = useState<QueryConfig>({
    name,
    sort_by: sort_by_options?.[0],
    order: "desc",
    page: 1,
  });

  // console.log({ queryConfig })

  const { data, isLoading } = useQuery(
    [queryFnFirstKey, JSON.stringify(queryConfig)],
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
    const searchParams_sortBy = searchParams.get("sort_by");
    const searchParams_order = searchParams.get("order");
    console.log(
      "query params changed to:",
      searchParams_sortBy,
      searchParams_order
    );
    setQueryConfig({
      ...queryConfig,
      ...(!!searchParams_sortBy &&
        sort_by_options.includes(searchParams_sortBy) && {
          sort_by: searchParams_sortBy,
        }),
      ...((searchParams_order === "asc" || searchParams_order === "desc") && {
        order: searchParams_order,
      }),
    });
  }, [
    searchParams.get("sort_by"),
    searchParams.get("order"),
    JSON.stringify(sort_by_options),
  ]);

  useEffect(() => {
    resetQuery();
  }, [name, queryConfig.sort_by, queryConfig.order]);

  useEffect(() => {
    if (data?.data) {
      const newData = data.data.map((datum: any) => ({
        ...(datumTransform(datum)),
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
    PaginationFilters: (
      <Pagination {...queryConfig} sort_by_options={sort_by_options} />
    ),
  };
};
