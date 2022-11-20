import { Card, CardContent, CardMedia, Paper, Typography } from '@mui/material'
import React from 'react'
import { stringSlice } from '../../helpers/stringSlice'
import { CardOverlay } from '../general/CardOverlay'
import { OwnerAvatar } from '../repos/OwnerAvatar'

export interface OneUser {
    id?: number,
    login?: string,
    avatar_url?: string,
    html_url?: string,
    name?: string,
    location?: string,
    bio?: string,
    public_repos?: number,
    followers?: number,
    following?: number,
    width?: number,
    height?: number|string,
}

export const ExploreUserCard = ({
    login="",
    bio="",
    html_url="",
    avatar_url="",
    width,
    height,
}: OneUser) => {
    return (
        <CardOverlay
            src={avatar_url}
            title={login}
            subtitle={stringSlice(bio, 30)}
            href={`/users?key=${login}`}
            height={height || 175}
            width={width || 400}
        />
    )
}