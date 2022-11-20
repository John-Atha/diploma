import { CardHeader, Paper, Typography } from '@mui/material'
import React from 'react'
import { OneRepoProps } from './OneRepo'

export const OneRepoBasicCard = ({
    name='',
    description='',
}: OneRepoProps) => {
    return (
        <Paper sx={{
            padding: 1,
        }}>
            <Typography variant='h6' align="center">
                {name}
            </Typography>
            <Typography variant='body2' align="center">
                {description}
            </Typography>
        </Paper>
    )
}