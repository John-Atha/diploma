import { Alert, Snackbar } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { closeSnackMessage, selectSnackMessage } from '../../redux/slices/snackMessageSlice';

export const SnackMessage = () => {
    const dispatch = useDispatch();

    const { text, severity, duration } = useSelector(selectSnackMessage);

    const close = () => dispatch(closeSnackMessage());

    if (!text) {
        return null;
    }

    return (
        <Snackbar
            open
            onClose={close}
            autoHideDuration={duration}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert
                severity={severity}
                onClose={close}
            >
                { text }
            </Alert>
        </Snackbar>
    )
}