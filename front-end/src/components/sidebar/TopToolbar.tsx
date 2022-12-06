import { PersonOutlined, SettingsOutlined } from "@mui/icons-material";
import { alpha, Badge, Grid, IconButton, Menu, MenuItem, Toolbar, useTheme } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { selectAuthUser } from "../../redux/slices/authSlice";
import { BreadCrumb } from "../general/BreadCrumbRoutes";

interface TopToolbarProps {
    openAuthMenu: (e: any) => void;
    closeAuthMenu: () => void;
    logout: () => void;
    setSettingsDrawerOpen: (a: boolean) => void;
    authMenuAnchorEl: any,
}
export const TopToolbar = ({
    openAuthMenu,
    closeAuthMenu,
    logout,
    setSettingsDrawerOpen,
    authMenuAnchorEl,
}: TopToolbarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useAppSelector(selectAuthUser);
  const isLogged = !!id;

  return (
    <Toolbar sx={{ backgroundColor: alpha(theme.palette.background.paper, 1) }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs>
          <BreadCrumb />
        </Grid>
        <Grid item>
          <Grid
            container
            spacing={1}
            height={1}
            paddingTop={1}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Grid item>
              <IconButton onClick={() => setSettingsDrawerOpen(true)}>
                <Badge badgeContent={2} color="primary">
                  <SettingsOutlined />
                </Badge>
              </IconButton>
            </Grid>
            <Grid item>
              <>
                <IconButton
                  id="auth-menu-button"
                  onClick={openAuthMenu}
                  aria-controls={!!authMenuAnchorEl ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={!!authMenuAnchorEl ? "true" : undefined}
                >
                  <PersonOutlined />
                </IconButton>
                <Menu
                  id="auth-menu"
                  anchorEl={authMenuAnchorEl}
                  open={!!authMenuAnchorEl}
                  onClose={closeAuthMenu}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  {isLogged && (
                    <MenuItem onClick={() => navigate("/profile")}>
                      My Profile
                    </MenuItem>
                  )}
                  {isLogged && (
                    <MenuItem onClick={() => logout()}>Logout</MenuItem>
                  )}
                  {!isLogged && (
                    <MenuItem
                      onClick={() => setSearchParams({ auth: "login" })}
                    >
                      Signin
                    </MenuItem>
                  )}
                  {!isLogged && (
                    <MenuItem
                      onClick={() => setSearchParams({ auth: "signup" })}
                    >
                      Signup
                    </MenuItem>
                  )}
                </Menu>
              </>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  );
};
