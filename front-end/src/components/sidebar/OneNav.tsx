import { List, ListItem, ListItemText, useTheme } from "@mui/material";
import { ReactElement } from "react";
import { OneNavLink } from "./OneNavLink";

export interface NavProps {
  text: string;
  slug: string;
  icon: ReactElement;
  isGroup?: boolean;
  needsAuth?: boolean;
  navs?: NavProps[];
}

export const OneNav = ({ isGroup, text, slug, icon, navs }: NavProps) => {
  const theme = useTheme();

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
            {navs?.map((nav) => (
              <OneNavLink {...nav} />
            ))}
          </List>
        </ListItem>
      </>
    );
  }
  return (
    <OneNavLink
      isGroup={isGroup}
      text={text}
      slug={slug}
      icon={icon}
      navs={navs}
    />
  );
};
