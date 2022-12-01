import {
  Chip,
  Grid,
  Paper,
  Typography,
  Stack,
  useTheme,
  alpha,
  Button,
} from "@mui/material";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SecondaryEntityProps } from "../general/OneSecondaryEntity";

export interface MovieRelativesProps {
  data: SecondaryEntityProps[];
  title: string;
  keyField: string;
  entityName: string;
}

export const MovieRelatives = ({
  data,
  title,
  entityName,
  keyField,
}: MovieRelativesProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
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
        {data.map(({ name, [keyField]: keyValue }) => (
          <Grid item key={keyValue}>
            <Chip
              label={name}
              component={Button}
              sx={{ textTransform: "none" }}
              onClick={() => navigate(`/${entityName}/${keyValue}`)}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
