import React from 'react';
import { Grid, CircularProgress } from '@mui/material';

export default function Spinner({ size=40 }) {
  return (
    <Grid container justifyContent="center">
      <CircularProgress sx={{ marginTop: "10px" }} size={size} />
    </Grid>
  );
}