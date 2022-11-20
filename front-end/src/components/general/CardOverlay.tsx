import { Card, CardContent, CardMedia, Grid, Typography, useTheme } from '@mui/material'
import React from 'react'
import { NavLink } from 'react-router-dom'

interface CardOverlayProps {
    src: string,
    title: string,
    subtitle?: string,
    height?: number|string,
    width?: number,
    alt?: string,
    href: string,
}

export const CardOverlay = ({
    src,
    title,
    subtitle,
    height=150,
    width=300,
    alt,
    href,
}: CardOverlayProps) => {
    const theme = useTheme();
    return (
        <Card
            sx={{
                height,
                width,
                borderRadius: 7,
                position: 'relative',
            }}
            component={NavLink}
            to={href}
        >
            <CardMedia
                component="img"
                height={height}
                image={src}
                alt={alt || title}
                sx={{
                    borderRadius: 5,
                    backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 1), transparent)",
                    width: 1,
                }}
            />
            <CardContent sx={{
                // width,
                position: "absolute",
                bottom: 0,
                width: 1,
                borderRadius: 5,
                height: 100,
                padding: 1,
                paddingBottom: "8px !important",
                background: "linear-gradient(to top, rgba(0, 0, 0, 1), transparent 50%)",
                color: theme.palette.primary.main,
            }}>
                <Grid container height={1} alignItems={"flex-end"}>
                    <Typography variant="body1">
                        {title}
                    </Typography>
                    <Typography variant="caption">
                        {subtitle}
                    </Typography>
                </Grid>
            </CardContent>
        </Card>
    )
}