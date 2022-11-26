import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import React, { cloneElement, ReactElement } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import SimpleBar from "simplebar-react";
import Spinner from "./Spinner";

interface SmallListProps {
  title: string;
  href: string;
  icon: ReactElement;
  data: any[];
  isLoading: boolean;
  oneElement: ReactElement;
}
export const SmallList = ({
  title,
  href,
  icon,
  data,
  isLoading,
  oneElement,
}: SmallListProps) => {
  const navigate = useNavigate();
  let content = null;

  if (isLoading) {
    content = <Spinner />;
  } else if (!data?.length) {
    return null;
  } else {
    content = (
      <Stack spacing={1} justifyContent="center">
        {data.map((repo: any) => cloneElement(oneElement, { ...repo }))}
      </Stack>
    );
  }
  return (
    <Paper elevation={0} sx={{ padding: 1, paddingTop: 2, width: 1 }}>
      <Grid container alignItems="center" rowSpacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Grid container alignItems="center">
                {cloneElement(icon, { fontSize: "small" })}
                <Typography variant="body1" fontWeight={600} align="center">
                  {title}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Button onClick={() => navigate(href)}>Explore</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <SimpleBar style={{ height: 250 }}>{content}</SimpleBar>
        </Grid>
      </Grid>
    </Paper>
  );
};
