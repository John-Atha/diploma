import React from "react";
import { LoginForm } from "./LoginForm";
import { Dialog, DialogTitle } from "@mui/material";

interface LoginDialogProps {
  onClose: () => void;
  showSignupDialog: () => void;
}
export const LoginDialog = ({
  onClose,
  showSignupDialog,
}: LoginDialogProps) => {
  return (
    <Dialog maxWidth="sm" fullWidth open onClose={onClose}>
      <DialogTitle align="center">Login</DialogTitle>
      <LoginForm onClose={onClose} showSignupDialog={showSignupDialog} />
    </Dialog>
  );
};
