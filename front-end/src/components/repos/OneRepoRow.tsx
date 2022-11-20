import { StarOutlined } from '@mui/icons-material';
import { Avatar, CardHeader, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { stringSlice } from '../../helpers/stringSlice';
import { OneRepoProps } from "./OneRepo";

export const OneRepoRow = ({
    id=0,
    name="",
    fullName="",
    description="",
    html_url="",
    topics=[],
    watchers=0,
    owner: {
        login="",
        avatar_url="",
        html_url: owner_html_url="",
    },
    stargazers_count=0,
}: OneRepoProps) => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <CardHeader
            component={NavLink}
            to={`/repos?key=${login}&repo=${name}`}
            sx={{ padding: 1, paddingLeft: 0, textDecoration: "none" }}
            avatar={
                <Avatar
                    alt="avatar"
                    src={avatar_url}
                    sx={{ height: 30, width: 30 }}
                />
            }
            titleTypographyProps={{
                color: theme.palette.primary.main,
            }}
            title={name}
            subheader={stringSlice(description, 20)}
            
            action={
                <Grid container alignItems="center" justifyContent={"flex-end"} sx={{ color: theme.palette.primary.main }}>
                    <StarOutlined fontSize='small' />
                    <Typography variant="body2">
                        { stargazers_count || 0 }
                    </Typography>
                </Grid>
            }
        />
    )

}
