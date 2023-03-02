import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import React, { cloneElement, ReactElement, useState } from "react";
import { NavLink } from "react-router-dom";

export const placeholderCardOverlay = {
  src: "",
  fallbackSrc: "",
  fallbackImg: undefined,
  title: "",
  subtitle: "",
  height: 100,
  width: 50,
  alt: "",
  href: "#",
};

interface CardOverlayProps {
  src: string;
  fallbackSrc?: string | ReactElement;
  fallbackImg?: ReactElement;
  title: string;
  subtitle?: string | ReactElement;
  height?: number | string;
  imgHeight?: number | string;
  width?: number;
  alt?: string;
  href: string;
  centerTitle?: boolean;
}

export const CardOverlay = ({
  src,
  fallbackSrc,
  fallbackImg,
  title,
  subtitle,
  height = 150,
  imgHeight = 150,
  width = 300,
  alt,
  href,
  centerTitle = false,
}: CardOverlayProps) => {
  const theme = useTheme();
  const [logo, setLogo] = useState<any>(src);
  const [focused, setFocused] = useState(false);

  const handleImageError = () => {
    console.log("did not load, searching for fallback: ", fallbackSrc);
    setLogo(fallbackSrc || null);
  };

  return (
    <Card
      sx={{
        height,
        width,
        borderRadius: 7,
        position: "relative",
      }}
      component={NavLink}
      to={href}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
    >
      <CardMedia
        component="img"
        height={height}
        image={logo}
        alt={alt}
        sx={{
          borderRadius: 5,
          width: 1,
        }}
        onError={handleImageError}
      />
      {(!src || !logo) &&
        !!fallbackImg &&
        cloneElement(fallbackImg, {
          style: {
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0",
            borderRadius: 5,
          },
        })}
      {/* <img src={logo} onError={() => setLogo(fallbackSrc)} /> */}
      {/* </CardMedia> */}
      <CardContent
        sx={{
          // width,
          position: "absolute",
          bottom: 0,
          width: 1,
          borderRadius: 5,
          height: 150,
          padding: 1,
          paddingBottom: "8px !important",
          background:
            `linear-gradient(to top, rgba(0, 0, 0, 0.8) ${focused ? "70%" : "30%"}, transparent 100%)`,
          color: theme.palette.primary.light,
        }}
      >
        <div style={{ position: "absolute", bottom: 0, width: "90%" }}>
          <Typography variant="body1" align={(centerTitle && focused) ? "center" : "left"} >{title}</Typography>
          {focused && <Typography variant="caption">{subtitle}</Typography>}
        </div>
      </CardContent>
    </Card>
  );
};
