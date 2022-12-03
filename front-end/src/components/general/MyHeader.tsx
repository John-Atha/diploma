import {
  Backdrop,
  Grid,
  Stack,
  useTheme,
  Card,
  ClickAwayListener,
} from "@mui/material";
import React, { useState } from "react";
import { SearchBar } from "../search/SearchBar";
import { SearchResultsList } from "../search/SearchResultsList";

export interface MyHeaderProps {
  searchProps: any;
}

export const MyHeader = ({ searchProps }: MyHeaderProps) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isShown, setIsShown] = useState(false);

  const handleClose = () => {
    if (isShown) {
      setIsFocused(false);
      setIsShown(false);
    }
  };

  const handleOpen = () => {
    setIsFocused(true);
    setTimeout(() => setIsShown(true), 1000);
  };

  return (
    <Grid container justifyContent="space-between" spacing={3} paddingLeft={2}>
      <Grid item xs={9} paddingRight={3}>
        <SearchBar {...searchProps} onFocus={handleOpen} isBackdropTrigger />
      </Grid>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          alignItems: "flex-start",
        }}
        open={isFocused}
        // onClick={handleClose}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Stack
            marginTop={10}
            spacing={0.5}
            justifyContent="flex-start"
            component={Card}
            width="80vw"
          >
            <SearchBar {...searchProps} />
            <SearchResultsList />
          </Stack>
        </ClickAwayListener>
      </Backdrop>
    </Grid>
  );
};
