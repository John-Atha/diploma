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
    try {
      pageIndex = parseInt(page as string);
    } catch (err) {
      throw "Invalid pagination parameters";
    }
  }
  if (size !== undefined) {
    try {
      pageSize = parseInt(size as string);
    } catch (err) {
      throw "Invalid pagination parameters";
    }
  }
  if (pageIndex <= 0 || pageSize <= 0)
    throw "Invalid pagination parameters";
  return { pageIndex, pageSize };
};
