import { customFields } from "./customFields";

interface PaginateQueryProps {
  query: string;
  pageSize: number;
  pageIndex: number;
}

export const paginateQuery = ({
  query,
  pageSize,
  pageIndex,
}: PaginateQueryProps) => {
  const limit = pageSize;
  const skip = (pageIndex - 1) * pageSize;
  const newQuery = query
    .replace(";", " ")
    .concat(`skip ${skip} limit ${limit};`);
  return newQuery;
};

export const getPaginationParams = (query: any) => {
  const { page, size } = query;
  let pageIndex = 1;
  let pageSize = 15;

  if (page !== undefined) {
    pageIndex = parseInt(page as string);
    if (isNaN(pageIndex)) throw "Invalid pagination parameters";
  }
  if (size !== undefined) {
    pageSize = parseInt(size as string);
    if (isNaN(pageSize)) throw "Invalid pagination parameters";
  }
  if (pageIndex <= 0 || pageSize <= 0) throw "Invalid pagination parameters";
  return { pageIndex, pageSize };
};

export const getOrderingParams = (query: any) => {
  const { sort_by, order } = query;

  if (order !== undefined && order !== "asc" && order !== "desc")
    throw "Order parameter should be either 'asc' or 'desc'";

  if (!sort_by && !!order)
    throw "Provide both 'sort_by' and 'order' parameters";

  return { sortBy: sort_by, order: order || "asc" };
};

interface SortQueryProps {
  query: string;
  resultNodeName: string;
  sortBy?: string;
  order?: "asc" | "desc";
}
export const sortQuery = ({
  query,
  sortBy,
  order,
  resultNodeName,
}: SortQueryProps) => {
  if (!sortBy) return { sortedQuery: query, params: {} };

  let sortFieldName = customFields.includes(sortBy)
    ? `${sortBy}`
    : `${resultNodeName}[$sortBy]`;
  let sortedQuery = query
    .replace(";", " ")
    .concat(`order by ${sortFieldName} ${order};`);
  if (!customFields.includes(sortBy)) {
    if (sortedQuery.toLowerCase().includes("where")) {
      sortedQuery = sortedQuery.replace(
        "return",
        `and tostring(${resultNodeName}[$sortBy])<>"NaN" return`
      );
    } else {
      sortedQuery = sortedQuery.replace(
        "return",
        `where tostring(${resultNodeName}[$sortBy])<>"NaN" return`
      );
    }
  }
  const params = { sortBy };
  return { sortedQuery, params };
};
