import {
  PersonOutlined,
  DashboardOutlined,
  ClassOutlined,
  NavigationOutlined,
  LanguageOutlined,
  FactoryOutlined,
  PublicOutlined,
  Explore,
  MovieOutlined,
  StarOutline,
} from "@mui/icons-material";

export const navs = [
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
        slug: "movies?sort_by=release_date&order=desc",
        text: "Movies",
        icon: <MovieOutlined />,
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
        slug: "ratings",
        text: "My Ratings",
        icon: <StarOutline />,
        needsAuth: true,
      },
      {
        slug: "profile",
        text: "My Profile",
        icon: <PersonOutlined />,
        needsAuth: true,
      },
    ],
  },
];
