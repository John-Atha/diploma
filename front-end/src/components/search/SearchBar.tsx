import { Clear, Search } from "@mui/icons-material";
import { Grid, IconButton, InputBase, Paper } from "@mui/material";
import React, {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";

interface SearchBarProps {
  initValue: any;
  placeholder?: string;
}

export const SearchBar = ({ initValue, placeholder }: SearchBarProps) => {
  const [value, setValue] = useState(initValue || "");
  const [searchParams, setSearchParams] = useSearchParams();
  const [elevation, setElevation] = useState(1);

  const submit = (event: SyntheticEvent) => {
    console.log("submitting");
    event.preventDefault();
    setSearchParams({ key: value });
  };

  const clear = () => setSearchParams({ key: "" });

  useEffect(() => {
    setValue(searchParams.get("key"));
  }, [searchParams]);

  return (
    <Paper component="form" onSubmit={submit} elevation={elevation}>
      <Grid container alignItems="center" padding={1}>
        <Grid item xs={11}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <IconButton type="submit" aria-label="search">
                <Search />
              </IconButton>
            </Grid>
            <Grid item xs>
              <InputBase
                sx={{ width: 1 }}
                placeholder={placeholder || "Search..."}
                inputProps={{ "aria-label": placeholder || "search" }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setElevation(5)}
                onBlur={() => setElevation(1)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}>
          <Grid container justifyContent="center" alignItems="center">
            <IconButton onClick={clear} aria-label="search">
              <Clear />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
