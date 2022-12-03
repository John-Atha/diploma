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
  fallbackSrc?: string;
  fallbackImg?: ReactElement;
  title: string;
  subtitle?: string | ReactElement;
  height?: number | string;
  width?: number;
  alt?: string;
  href: string;
}

export const CardOverlay = ({
  src,
  fallbackSrc,
  fallbackImg,
  title,
  subtitle,
  height = 150,
  width = 300,
  alt,
  href,
}: CardOverlayProps) => {
  const theme = useTheme();
  const [logo, setLogo] = useState<any>(src);

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
    >
      <CardMedia
        component="img"
        height={height}
        image={src}
        alt={alt}
        sx={{
          borderRadius: 5,
          backgroundImage:
            "linear-gradient(to top, rgba(0, 0, 0, 1), transparent)",
          width: 1,
        }}
      />
      {!src &&
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
          height: 100,
          padding: 1,
          paddingBottom: "8px !important",
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 1), transparent 100%)",
          color: theme.palette.primary.light,
        }}
      >
        <div style={{ position: "absolute", bottom: 0 }}>
          <Typography variant="body1">{title}</Typography>
          <Typography variant="caption">{subtitle}</Typography>
        </div>
      </CardContent>
    </Card>
  );
};
