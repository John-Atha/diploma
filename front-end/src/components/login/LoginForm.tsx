import React, { useState } from 'react'
import { GitHub } from '@mui/icons-material';
import { Button, Grid, TextField, Typography, useTheme } from '@mui/material';
import { useAppDispatch } from '../../redux/hooks'
import { setSnackMessage } from "../../redux/slices/snackMessageSlice";

interface LoginFormProps {
    onClose: () => void,
}
export const LoginForm = ({ onClose }: LoginFormProps) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [token, setToken] = useState("");

    const login = () => {
        console.log(token);
        if (!token) {
            dispatch(setSnackMessage({
                text: "Token cannot be empty",
                severity: "warning",
            }))
        }
        else {
            localStorage.setItem("token", token);
            dispatch(setSnackMessage({
                text: "Logged in successfully",
                severity: "success",
            }));
            onClose();
        }
    }

    return (
        <Grid container rowSpacing={3} justifyContent="center" padding={3}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="center">
                    <GitHub sx={{ fontSize: 25 }} />
                    <Typography variant="h6" align="center" sx={{ paddingLeft: 1 }}>
                        Login
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Token"
                    fullWidth
                    name="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent="center">
                    <Grid item>
                        <Button onClick={login} variant="contained">
                            Login
                        </Button>
                    </Grid>
                    <Grid item xs={12} marginTop={1} />
                    <a style={{ color: theme.palette.primary.main }} href="https://www.github.com" target="_blank" rel="noopener noreferrer">
                        Don't have a GitHub account?
                    </a>
                </Grid>
            </Grid>
        </Grid>
    )
}