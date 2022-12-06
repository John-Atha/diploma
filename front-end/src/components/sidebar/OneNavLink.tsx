import { ListItem, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import { cloneElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { selectAuthUser } from "../../redux/slices/authSlice";
import { NavProps } from "./OneNav";

export const OneNavLink = ({ text, slug, icon, needsAuth }: NavProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useAppSelector(selectAuthUser);
  const isLogged = !!id;

  const path = location.pathname;
  const curr = path.split("/")[1].toLowerCase();
  const slug_root = slug
    .replace("/", "")
    .slice(0, slug.indexOf("?") !== -1 ? slug.indexOf("?") : slug.length);
  const selected = curr === slug_root;
  const disabled = needsAuth && !isLogged;

  const color = selected ? theme?.palette?.primary?.main : "inherit";
  return (
    <ListItem
      button
      key={text}
      onClick={() => navigate(`/${slug}`)}
      sx={{
        borderRadius: 0,
        borderRight: `5px solid ${color}`,
      }}
      disabled={disabled}
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
