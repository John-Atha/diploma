import { Chip, Grid } from '@mui/material'
import React from 'react'

interface TagsProps {
    tags: string[],
    centered?: boolean,
}

export const Tags = ({ tags, centered=false }: TagsProps) => {
    return (
        <Grid container spacing={1} justifyContent={centered ? "center" : "flex-start"}>
            {tags.map((tag: string, index: number) => (
                <Grid item key={index}>
                    <Chip color='primary' variant="outlined" label={tag} />
                </Grid>
            ))}
        </Grid>
    )
}