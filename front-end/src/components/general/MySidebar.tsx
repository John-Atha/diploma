import React, { useState, ReactElement, cloneElement } from "react";
import { alpha, styled } from "@mui/material/styles";
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
  Explore,
  SettingsOutlined,
  PersonOutline,
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
  Badge,
  Grid,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LoginDialog } from "../login/LoginDialog";
import backgroundImage from "../../images/bg2.png";
import { BreadCrumb } from "./BreadCrumbRoutes";

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
      isGroup: false,
      slug: "",
      text: "Dashboard",
      icon: <DashboardOutlined />,
    },
    {
      isGroup: true,
      slug: "",
      text: "Explore",
      icon: <Explore />,
      navs: [
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
          slug: "people",
          text: "Crew",
          icon: <PersonOutlined />,
        },
        {
          slug: "productioncountries",
          text: "Countries",
          icon: <PublicOutlined />,
        },
        {
          slug: "languages",
          text: "Languages",
          icon: <LanguageOutlined />,
        },
        {
          slug: "productioncompanies",
          text: "Companies",
          icon: <FactoryOutlined />,
        },
      ],
    },
    {
      isGroup: true,
      slug: "",
      text: "Account",
      icon: <PersonOutlined />,
      navs: [
        {
          slug: "profile",
          text: "Profile",
          icon: <PersonOutlined />,
        },
        {
          slug: "settings",
          text: "Settings",
          icon: (
            <Badge badgeContent={2} color="primary">
              <SettingsOutlined />
            </Badge>
          ),
        },
      ],
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
    isGroup?: boolean;
    navs?: NavProps[];
  }

  const renderOneLink = ({ text, slug, icon }: NavProps) => {
    const path = location.pathname;
    const curr = path.split("/")[1].toLowerCase();
    console.log({ p: curr })
    const selected = curr === slug.replace("/", "");
    const color = selected ? theme?.palette?.primary?.main : "inherit";
    return (
      <ListItem
        button
        key={text}
        onClick={() => goToPage(slug)}
        sx={{
          borderRadius: 0,
          borderRight: `5px solid ${color}`,
        }}
      >
        <ListItemIcon>{cloneElement(icon, { htmlColor: color })}</ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{
            sx: { fontWeight: selected ? "bold" : "normal" },
          }}
        />
      </ListItem>
    );
  };

  const renderOneNav = ({ isGroup, text, slug, icon, navs }: NavProps) => {
    if (isGroup) {
      return (
        <>
          <ListItem key={text} sx={{ paddingBottom: 0 }}>
            {/* <ListItemIcon>{cloneElement(icon)}</ListItemIcon> */}
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                sx: { color: theme.palette.text.disabled },
              }}
            />{" "}
          </ListItem>
          <ListItem sx={{ paddingRight: 0, paddingTop: 0 }}>
            <List sx={{ width: 1 }} disablePadding>
              {navs?.map((nav) => renderOneLink(nav))}
            </List>
          </ListItem>
        </>
      );
    }
    return renderOneLink({ isGroup, text, slug, icon, navs });
  };

  const renderNavs = () => {
    return (
      <List>
        {navs.map((nav, index) => renderOneNav({ ...nav, index } as any))}
      </List>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MyAppBar>
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
                  <IconButton>
                    <Badge badgeContent={2} color="primary">
                      <SettingsOutlined />
                    </Badge>
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton>
                    <PersonOutline />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
              color: theme.palette.text.primary,
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
