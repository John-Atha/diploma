import React from "react";
import {
  alpha,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Paper,
  Rating,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";

export interface SecondaryEntityProps {
  id: number;
  name: string;
  movies_count: number;
  distribution?: number[];
  height?: number | string;
  width?: number | string;
  href: string;
}

export const placeholderSecondaryEntity = {
  id: 0,
  name: "",
  movies_count: 0,
  href: "",
};

export const OneSecondaryEntity = ({
  id,
  name,
  movies_count,
  height=150,
  width,
  href,
  distribution = [
    Math.random() * 1000,
    Math.random() * 1000,
    Math.random() * 1000,
    Math.random() * 1000,
    Math.random() * 1000,
  ],
}: SecondaryEntityProps) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const renderSparkLine = () => {
    return (
      <Sparklines
        data={distribution}
        limit={distribution?.length || 10}
        svgWidth={50}
        svgHeight={20}
        margin={2}
      >
        <SparklinesLine color={theme.palette.primary.main} />
      </Sparklines>
    );
  };

  return (
    <Card
      component={Paper}
      elevation={3}
      sx={{
        width: width || 300,
        ...(height && { height }),
        ...(!height && { minHeight: 250 }),
        backgroundColor: alpha(theme.palette.primary.main, 0.03),
      }}
    >
      <Grid container height={1} alignItems="space-between">
        <Grid item xs={12}>
          <CardContent>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Stack>
                  <Typography
                    variant="h6"
                    component={NavLink}
                    to={href}
                    sx={{
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    {name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    {movies_count} movies
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>{renderSparkLine()}</Grid>
            </Grid>
          </CardContent>
        </Grid>
        <Grid item xs={12}>
          <CardActions sx={{ height: 1 }}>
            <Grid container height={1} alignItems="flex-end">
              <Button size="small" onClick={() => navigate(href)}>
                See more
              </Button>
            </Grid>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};
