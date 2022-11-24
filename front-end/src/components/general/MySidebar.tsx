import React, { useState, ReactElement } from "react";
import { styled } from "@mui/material/styles";
import {
  GitHub,
  Home,
  PersonOutlined,
  DashboardOutlined,
  FolderOutlined,
  PersonAddAltOutlined,
  ExploreOutlined,
  ClassOutlined,
  NavigationOutlined,
  LanguageOutlined,
  FactoryOutlined,
  PublicOutlined,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LoginDialog } from "../login/LoginDialog";
import backgroundImage from "../../images/bg2.png";

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
  const location = useLocation();
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showingLogin, setShowingLogin] = useState(false);

  const renderLogin = () => {
    if (showingLogin) {
      return <LoginDialog onClose={() => setShowingLogin(false)} />;
    }
  };

  const navs = [
    {
      slug: "",
      text: "Dashboard",
      icon: <DashboardOutlined />,
    },
    {
      slug: "genres",
      text: "Genres",
      icon: <ClassOutlined />,
    },
    {
      slug: "keywords",
      text: "Keywords",
      icon: <NavigationOutlined />,
    },
    {
      slug: "languages",
      text: "Languages",
      icon: <LanguageOutlined />,
    },
    {
      slug: "companies",
      text: "Companies",
      icon: <FactoryOutlined />,
    },
    {
      slug: "countries",
      text: "Countries",
      icon: <PublicOutlined />,
    },
    {
      slug: "people",
      text: "People",
      icon: <PersonOutlined />,
    },
    // {
    //   slug: "users",
    //   text: "Users",
    //   icon: <PersonOutlined />,
    // },
    // {
    //   slug: "repos",
    //   text: "Repositories",
    //   icon: <FolderOutlined />,
    // },
    // {
    //   slug: "contacts",
    //   text: "Contacts",
    //   icon: <PersonAddAltOutlined />,
    // },
    // {
    //   slug: "explore",
    //   text: "Explore",
    //   icon: <ExploreOutlined />,
    // },
  ];

  const goToPage = (slug: string) => {
    const key = searchParams.get("key");
    if (key) {
      navigate(`/${slug}?key=${key}`);
    } else {
      navigate(`/${slug}`);
    }
  };

  interface NavProps {
    text: string;
    slug: string;
    icon: ReactElement;
    index: number;
  }

  const renderOneNav = ({ text, slug, icon, index }: NavProps) => {
    const path = location.pathname;
    const selected = path.slice(1) === slug;
    return (
      <ListItem
        button
        key={index}
        onClick={() => goToPage(slug)}
        sx={{
          borderRadius: 2,
          bgcolor: selected ? theme?.palette?.primary?.light : "inherit",
          color: "auto",
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    );
  };

  const renderNavs = () => {
    return navs.map(({ text, slug, icon }, index) =>
      renderOneNav({ text, slug, icon, index })
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MyAppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome
          </Typography>
          <Button
            startIcon={<GitHub />}
            onClick={() => setShowingLogin(true)}
            color="inherit"
          >
            Login
          </Button>
        </Toolbar>
      </MyAppBar>
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
        open
      >
        <DrawerHeader>
          <Button
            fullWidth
            onClick={() => goToPage("")}
            startIcon={<Home />}
            size="large"
            sx={{
              textTransform: "none",
              fontSize: 20,
              justifyContent: "flex-start",
            }}
          >
            MovieOn
          </Button>
        </DrawerHeader>
        <Divider sx={{ marginBottom: 1 }} />
        <List>{renderNavs()}</List>
      </Drawer>
      <Main
        style={{
          paddingBottom: "24px !important",
          backgroundImage: `url(${backgroundImage})`,
          backgroundPositionY: "bottom",
          backgroundSize: "cover",
          
        }}
      >
        <DrawerHeader />
        {children}
        {renderLogin()}
      </Main>
    </Box>
  );
}
