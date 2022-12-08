import { createTheme, PaletteMode, ThemeProvider } from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import MySidebar from "../components/sidebar/MySidebar";
import { SnackMessage } from "../components/general/SnackMessage";
import { useAuth } from "../hooks/useAuth";
import { useAppSelector } from "../redux/hooks";
import { selectTheme } from "../redux/slices/themeSlice";
import { useRatings } from "../hooks/useRatings";

interface SkeletonProps {
  children: ReactElement | ReactElement[];
}

export const PageSkeleton = ({ children }: SkeletonProps) => {
  const { loginWithToken } = useAuth();
  useRatings();
  const { primary__main, mode } = useAppSelector(selectTheme);

  const [theme_, setTheme_] = useState<any>(null);

  useEffect(() => {
    loginWithToken();
  }, []);

  useEffect(() => {
    const newTheme = createTheme({
      palette: {
        mode: mode as PaletteMode,
        primary: {
          main: primary__main[500],
        },
      },
    });
    setTheme_(newTheme);
  }, [primary__main, mode]);

  if (theme_) {
    return (
      <ThemeProvider theme={theme_}>
        <MySidebar children={children} />
        <SnackMessage />
      </ThemeProvider>
    );
  }
  return (
    <>
      <MySidebar children={children} />
      <SnackMessage />
    </>
  );
};
