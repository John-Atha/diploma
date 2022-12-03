import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { useSearchParams } from "react-router-dom";

interface PaginationProps {
  sort_by_options: string[];
  sort_by?: string;
  order?: string;
}

export const Pagination = ({
  sort_by_options,
  sort_by,
  order,
}: PaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParam = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    newSearchParams.set(key, value);
    setSearchParams(newSearchParams);
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="flex-end"
      spacing={1}
      width={1}
    >
      <Grid item xs>
        <FormControl fullWidth>
          <InputLabel id="sort-by-label">Sort by</InputLabel>
          <Select
            labelId="sort-by-label"
            id="sort-by"
            value={sort_by}
            label="Sort by"
            onChange={(e) => setParam("sort_by", e.target.value)}
          >
            {sort_by_options.map((option) => (
              <MenuItem value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs>
        <FormControl fullWidth>
          <InputLabel id="order-label">Order</InputLabel>
          <Select
            labelId="order-label"
            id="order"
            value={order}
            label="Order"
            onChange={(e) => setParam("order", e.target.value)}
          >
            <MenuItem value={"asc"}>Ascending</MenuItem>
            <MenuItem value={"desc"}>Descending</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};
