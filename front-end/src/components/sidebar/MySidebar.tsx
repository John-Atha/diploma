import React, { useState, ReactElement, useEffect } from "react";
import { styled } from "@mui/material/styles";

import { Box, CssBaseline, AppBar, useTheme } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginDialog } from "../loginRegister/LoginDialog";
import { SignUpDialog } from "../loginRegister/SignupDialog";
import { useAppSelector } from "../../redux/hooks";
import { selectAuthUser } from "../../redux/slices/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { RightDrawer } from "./RightDrawer";
import { LeftDrawer } from "./LeftDrawer";
import { TopToolbar } from "./TopToolbar";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  })
);

const MyAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: `${drawerWidth}px`,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

interface MySidebarProps {
  children: ReactElement | ReactElement[];
}

export default function MySidebar({ children }: MySidebarProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showingLogin, setShowingLogin] = useState(false);
  const [showingSignup, setShowingSignup] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [authMenuAnchorEl, setAuthMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);

  const { logout: logoutMethod } = useAuth();
  const { username, id, token } = useAppSelector(selectAuthUser);

  useEffect(() => {
    setIsLogged(!!id);
  }, [id]);

  const renderAuthPopUps = () => {
    if (showingLogin) {
      return (
        <LoginDialog
          onClose={() => setSearchParams({ auth: "" })}
          showSignupDialog={showSignup}
        />
      );
    } else if (showingSignup) {
      return (
        <SignUpDialog
          onClose={() => setSearchParams({ auth: "" })}
          showLoginDialog={showLogin}
        />
      );
    }
  };

  const showLogin = () => {
    setShowingLogin(true);
    setShowingSignup(false);
  };
  const showSignup = () => {
    setShowingLogin(false);
    setShowingSignup(true);
  };

  const openAuthMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event);
    setAuthMenuAnchorEl(event.currentTarget);
  };
  const closeAuthMenu = () => {
    setAuthMenuAnchorEl(null);
  };

  const logout = () => {
    logoutMethod();
    closeAuthMenu();
  };

  useEffect(() => {
    if (searchParams.get("auth") === "login") showLogin();
    else if (searchParams.get("auth") === "signup") showSignup();
    else {
      setShowingLogin(false);
      setShowingSignup(false);
    }
  }, [searchParams.get("auth")]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <MyAppBar>
        <TopToolbar
          openAuthMenu={openAuthMenu}
          closeAuthMenu={closeAuthMenu}
          logout={logout}
          setSettingsDrawerOpen={setSettingsDrawerOpen}
          authMenuAnchorEl={authMenuAnchorEl}
        />
      </MyAppBar>
      <LeftDrawer
        open={leftDrawerOpen}
        onClose={() => setLeftDrawerOpen(false)}
        drawerWidth={drawerWidth}
        DrawerHeader={DrawerHeader}
      />
      <Main
        style={{
          paddingBottom: "24px !important",
          backgroundColor: theme.palette.background.default,
          backgroundPositionY: "bottom",
          backgroundSize: "cover",
        }}
      >
        <DrawerHeader />
        {children}
        {renderAuthPopUps()}
      </Main>
      <RightDrawer
        open={settingsDrawerOpen}
        onClose={() => setSettingsDrawerOpen(false)}
        DrawerHeader={DrawerHeader}
      />
    </Box>
  );
}
