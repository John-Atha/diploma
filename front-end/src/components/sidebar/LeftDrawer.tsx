import { Home } from "@mui/icons-material";
import { Button, Divider, Drawer, List, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { NavsList } from "./NavsList";

export interface LeftDrawerProps {
  drawerWidth: number;
  open: boolean;
  onClose: () => void;
  DrawerHeader: any;
}

export const LeftDrawer = ({
  drawerWidth,
  open,
  onClose,
  DrawerHeader,
}: LeftDrawerProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <DrawerHeader>
        <Button
          fullWidth
          onClick={() => navigate("/")}
          startIcon={<Home />}
          size="large"
          sx={{
            textTransform: "none",
            fontSize: 20,
            justifyContent: "flex-start",
            color: theme.palette.text.primary,
          }}
        >
          MovieOn
        </Button>
      </DrawerHeader>
      <Divider sx={{ marginBottom: 1 }} />
      <NavsList />
    </Drawer>
  );
};
