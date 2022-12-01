import {
  Chip,
  Grid,
  Paper,
  Typography,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";
import React from "react";
import { SecondaryEntityProps } from "../general/OneSecondaryEntity";

export interface MovieRelativesProps {
  data: SecondaryEntityProps[];
  title: string;
}

export const MovieRelatives = ({ data, title }: MovieRelativesProps) => {
  const theme = useTheme();
  if (!data.length) return null;

  return (
    <Paper
      component={Stack}
      sx={{
        width: 1,
        padding: 1,
        height: 1,
        bgcolor: alpha(theme.palette.background.paper, 0.1),
      }}
      spacing={1}
    >
      <Typography variant="body1">{title}</Typography>
      <Grid container spacing={1}>
        {data.map(({ name }) => (
          <Grid item>
            <Chip label={name} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
