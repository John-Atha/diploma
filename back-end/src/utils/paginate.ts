interface PaginateProps {
  query: string;
  pageSize: number;
  pageIndex: number;
}

export const paginate = ({
  query,
  pageSize,
  pageIndex,
}: PaginateProps) => {
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
    if (isNaN(pageIndex))
      throw "Invalid pagination parameters";
  }
  if (size !== undefined) {
      pageSize = parseInt(size as string);
      if (isNaN(pageSize))
        throw "Invalid pagination parameters";
  }
  if (pageIndex <= 0 || pageSize <= 0)
    throw "Invalid pagination parameters";
  return { pageIndex, pageSize };
};
