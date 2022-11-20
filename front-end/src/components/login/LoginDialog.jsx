import React from "react";
import { LoginForm } from "./LoginForm";
import { Dialog } from "@mui/material";

export const LoginDialog = ({ onClose }) => {
    return (
        <Dialog maxWidth="sm" fullWidth open onClose={onClose}>
            <LoginForm onClose={onClose} />
        </Dialog>
    )
}