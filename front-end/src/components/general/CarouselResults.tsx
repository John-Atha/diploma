import { Card, CardContent, Paper, Typography } from "@mui/material";
import React, { cloneElement, ReactElement } from "react";
import MyCarousel from "./MyCarousel";
import Spinner from "./Spinner";

interface CarouselResultsProps {
  data: any[];
  isLoading: boolean;
  title?: string;
  elevation?: number;
  width?: number | string;
  maxWidth?: number | string;
  oneResultComponent: ReactElement;
  isSmallList?: boolean;
}
export const CarouselResults = ({
  data,
  isLoading,
  title = "",
  elevation = 0,
  width,
  maxWidth,
  oneResultComponent,
  isSmallList = false,
}: CarouselResultsProps) => {
  let content = null;

  if (isLoading) {
    content = <Spinner />;
  } else if (!data?.length) {
    return null;
  } else {
    content = (
      <MyCarousel
        items={data?.map((datum: any) =>
          cloneElement(oneResultComponent, { ...datum })
        )}
        isSmallList={isSmallList}
      />
    );
  }

  return (
    <Card
      sx={{
        width: width || 1,
        ...(maxWidth && { maxWidth }),
        bgcolor: "inherit",
      }}
      elevation={elevation}
    >
      <CardContent>
        <Typography variant="h6" sx={{ padding: 1 }}>
          {title}
        </Typography>
        <Paper elevation={0} sx={{ padding: 1, bgcolor: "inherit" }}>
          {content}
        </Paper>
      </CardContent>
    </Card>
  );
};
