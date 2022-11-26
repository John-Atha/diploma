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
      <Grid item xs={3}>
        <Grid
          container
          spacing={1}
          height={1}
          paddingTop={1}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item>
            <IconButton>
              <Badge badgeContent={2} color="primary">
                <SettingsOutlined />
              </Badge>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton>
              <PersonOutline />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
