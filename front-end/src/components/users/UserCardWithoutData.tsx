import { Alert, Card, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { queriesKeys } from '../../api/queriesKeys'
import { getUser } from '../../api/user'
import { useAppDispatch } from '../../redux/hooks'
import { setSearchUser } from '../../redux/slices/searchUser'
import Spinner from '../general/Spinner'
import { OwnerAvatar } from '../repos/OwnerAvatar'
import { UserCard } from './UserCard'

export interface OneUser {
    id: number,
    login: string,
    avatar_url: string,
    html_url: string,
    name: string,
    location: string,
    bio: string,
    public_repos: number,
    followers: number,
    following: number,
}

interface OneUserProps {
    username: string|null,
    showLink?: boolean,
}

export const UserCardWithoutData = ({
    username,
    showLink=false,
}: OneUserProps) => {
    const dispatch = useAppDispatch();
    const { data, isLoading } = useQuery(
        [queriesKeys['getUser'], username],
        () => getUser({ username: username || "" }), {
            enabled: Boolean(username),
            cacheTime: 10000,
            refetchOnWindowFocus: false,
        }
    )

    useEffect(() => {
        if(!isLoading && data) {
            dispatch(setSearchUser({ user: data }));
        }
    }, [data, isLoading])

    console.log({ data });

    if (isLoading) {
        return (
            <Spinner />
        )
    }

    if (!data) {
        return (
            <Alert severity='info'>
                User '{username}' not found
            </Alert>
        )
    }

    return (
        <UserCard
            {...data}
            showLink
        />
    )
}