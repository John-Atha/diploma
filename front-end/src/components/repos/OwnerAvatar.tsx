import { Avatar, CardHeader, useTheme } from '@mui/material'
import React from 'react'
import { NavLink } from 'react-router-dom'

interface OwnerAvatarProps {
    username: string,
    avatar_url: string,
    href?: string,
    height?: number,
    width?: number,
    subheader?: string,
    showLink?: boolean,
}
export const OwnerAvatar = ({
    username,
    avatar_url,
    href="#",
    height=25,
    width=25,
    subheader,
    showLink=false,
}: OwnerAvatarProps) => {
    const theme = useTheme();
    const renderAction = () => {
        if (showLink) {
            return (
                <a href={href} onClick={(e) => e.stopPropagation()}>
                    Github profile
                </a>
            )
        }
        return null;
    }
    return (
        <CardHeader
            component={NavLink}
            to={`/users?key=${username}`}
            sx={{ padding: 1, paddingLeft: 0, textDecoration: "none" }}
            avatar={
                <Avatar
                    alt="avatar"
                    src={avatar_url}
                    sx={{ height, width }}
                />
            }
            titleTypographyProps={{
                color: theme.palette.primary.main,
            }}
            title={username}
            subheader={subheader}
            action={renderAction()}
        />
    )
}