import { Paper } from "@mui/material";
import React from "react";

export const Logger = (props: any) => {
  return <Paper>{JSON.stringify(props || {})}</Paper>;
};
