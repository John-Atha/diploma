import React from "react";
import { LoginForm } from "./LoginForm";
import { Dialog, DialogTitle } from "@mui/material";
import { SignupForm } from "./SignupForm";

interface SignUpDialogProps {
  onClose: () => void;
  showLoginDialog: () => void;
}

export const SignUpDialog = ({
  onClose,
  showLoginDialog,
}: SignUpDialogProps) => {
  return (
    <Dialog maxWidth="sm" fullWidth open onClose={onClose}>
      <DialogTitle align="center">Signup</DialogTitle>
      <SignupForm onClose={onClose} showLoginDialog={showLoginDialog} />
    </Dialog>
  );
};
