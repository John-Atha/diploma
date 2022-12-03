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
  onFocus?: () => void;
  isBackdropTrigger?: boolean;
  entityName?: string;
}

export const SearchBar = ({
  initValue,
  placeholder,
  onFocus,
  isBackdropTrigger = false,
  entityName = "Movies",
}: SearchBarProps) => {
  const [value, setValue] = useState(initValue || "");
  const [searchParams, setSearchParams] = useSearchParams();

  const submit = (event: SyntheticEvent) => {
    console.log("submitting");
    event.preventDefault();
    const newSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    newSearchParams.set("key", value);
    newSearchParams.set("entity", entityName);
    setSearchParams(newSearchParams);
  };

  const clear = () => setSearchParams({ key: "" });

  useEffect(() => {
    setValue(searchParams.get("key"));
  }, [searchParams]);

  return (
    <Paper component="form" onSubmit={submit} elevation={1}>
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
                value={isBackdropTrigger ? "" : value}
                onChange={(e) =>
                  isBackdropTrigger ? () => {} : setValue(e.target.value)
                }
                onFocus={() => !!onFocus && onFocus()}
                {...(!isBackdropTrigger && { autoFocus: true })}
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
