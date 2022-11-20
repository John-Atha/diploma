import { Dialog } from '@mui/material';
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { closeDialog, selectDialog } from '../../redux/slices/dialogSlice'

export const GeneralDialog = () => {
    const dispatch = useAppDispatch();
    const { content } = useAppSelector(selectDialog);

    if (!content) return null;

    return (
        <Dialog open onClose={()=>dispatch(closeDialog())}>
            {content}
        </Dialog>
    )
}