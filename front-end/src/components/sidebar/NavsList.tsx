import { List } from "@mui/material";
import { navs } from "./navs";
import { OneNav } from "./OneNav";

export const NavsList = () => {
  return (
    <List>
      {navs.map((nav, index) => (
        <OneNav {...nav} key={index} />
      ))}
    </List>
  );
};
