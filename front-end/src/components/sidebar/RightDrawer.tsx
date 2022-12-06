import { Divider, Drawer, Typography } from "@mui/material";
import { ThemeDrawerContent } from "../general/ThemeDrawerContent";

export interface RightDrawerProps {
  open: boolean;
  onClose: () => void;
  DrawerHeader: any;
}
export const RightDrawer = ({
  open,
  onClose,
  DrawerHeader,
}: RightDrawerProps) => {
  return (
    <Drawer
      sx={{
        width: 270,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 270,
          boxSizing: "border-box",
        },
      }}
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <DrawerHeader>
        <Typography variant="h6" sx={{ width: 1 }}>
          Theming
        </Typography>
      </DrawerHeader>
      <Divider sx={{ marginBottom: 1 }} />
      <ThemeDrawerContent />
    </Drawer>
  );
};
