import { Button, Grid, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectTheme, setTheme } from "../../redux/slices/themeSlice";

export const ThemeDrawerContent = () => {
  const theme = useTheme();
  const { primary__main, mode, primary__options, mode_options } =
    useAppSelector(selectTheme);
  const dispatch = useAppDispatch();

  const setColor = (main: any) => {
    dispatch(
      setTheme({
        primary__main: main,
        mode,
      })
    );
  };

  const setMode = (newMode: string) => {
    dispatch(
      setTheme({
        primary__main,
        mode: newMode,
      })
    );
  };

  return (
    <Stack spacing={2} padding={1}>
      <Stack spacing={1}>
        <Typography variant="h6">Color</Typography>
        <Grid container spacing={1}>
          {primary__options?.map((main) => (
            <Grid item>
              <Button
                sx={{ backgroundColor: main[500], color: "white" }}
                onClick={() => setColor(main)}
              >
                {main[500]}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h6">Mode</Typography>
        <Grid container spacing={1}>
          {mode_options?.map((mode) => (
            <Grid item>
              <Button onClick={() => setMode(mode)}>{mode}</Button>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};
