import { PersonOutline, SettingsOutlined } from "@mui/icons-material";
import {
  Badge,
  Grid,
  IconButton,
  useTheme,
} from "@mui/material";
import React from "react";
import { SearchBar } from "../search/SearchBar";

export interface MyHeaderProps {
  searchProps: any;
}

export const MyHeader = ({ searchProps }: MyHeaderProps) => {
  const theme = useTheme();
  return (
    <Grid container justifyContent="space-between" spacing={3} paddingLeft={2}>
      <Grid item xs={9} paddingRight={3}>
        <SearchBar {...searchProps} />
      </Grid>
    </Grid>
  );
};
