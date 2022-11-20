import {
  alpha,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface SimpleCardProps {
  subtitle: string;
  title?: string | number;
  href: string;
  icon: any;
  severity: "success" | "info" | "error" | "warning" | "primary";
  isLoading?: boolean;
}

export const SimpleCard = ({
  subtitle,
  title,
  href,
  icon,
  severity,
  isLoading = false,
}: SimpleCardProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const goToHref = () => {
    if (href === "#") return;
    if (href.startsWith("https://")) {
      window.location.href = href;
      return;
    }
    const key = searchParams.get("key");
    if (key) {
      navigate(`/${href}?key=${key}`);
    } else {
      navigate(`/${href}`);
    }
  };

  if (isLoading) {
    return <Skeleton width={175} height={150} />;
  }

  return (
    <Button sx={{ textTransform: "none" }} onClick={goToHref}>
      <Card
        component={Paper}
        sx={{
          width: 175,
          height: 150,
          bgcolor: alpha(theme.palette[severity].main, 0.2),
        }}
      >
        <CardContent sx={{ height: 1 }}>
          <Grid
            container
            height={1}
            justifyContent={"center"}
            alignContent="space-between"
          >
            <Grid item xs={6}>
              <Grid
                container
                component={Paper}
                sx={{
                  borderRadius: "50%",
                  backgroundColor: alpha(theme.palette[severity].main, 0.1),
                  justifyContent: "center",
                  alignContent: "center",
                  height: 50,
                }}
              >
                {icon}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                {title}
              </Typography>
              <Typography
                variant="caption"
                align="center"
                sx={{ wordBreak: "break-all" }}
              >
                {subtitle}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Button>
  );
};
