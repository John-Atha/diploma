import React, { useEffect, useState } from 'react'
import { UsernameProps } from '../repos/Repos'
import { useQuery } from 'react-query'
import { queriesKeys } from '../../api/queriesKeys'
import { getFollowers, getFollows } from '../../api/user'
import Spinner from '../general/Spinner'
import { Grid, Typography } from '@mui/material'
import { GeneralChart } from "../charts/GeneralChart";
import { UserCard } from '../users/UserCard'
import { Results } from '../general/Results'
import { pagiStep } from '../../api/config'
import { usePrevious } from '../../hooks/usePrevious'
import { NavLink } from 'react-router-dom'
import { selectSearchUser } from '../../redux/slices/searchUser'
import { useSelector } from 'react-redux'

export const Contacts = ({ value: username }: UsernameProps) => {

    const prevUsername = usePrevious(username);
    const { user } = useSelector(selectSearchUser);

    console.log({ global_user: user });

    const { followers: totalFollowers=0, following: totalFollows=0 } = user || {};


    const { data: followers, isLoading: areFollowersLoading } = useQuery(
        [queriesKeys['getFollowers'], username],
        () => getFollowers({ username: username || "" }), {
            enabled: Boolean(username),
            cacheTime: 10000,
            refetchOnWindowFocus: false,
        }
    )

    const { data: follows, isLoading: areFollowsLoading } = useQuery(
        [queriesKeys['getFollows'], username],
        () => getFollows({ username: username || "" }), {
            enabled: Boolean(username),
            cacheTime: 10000,
            refetchOnWindowFocus: false,
        }
    )

    const renderChart = () => {
        if (areFollowsLoading || areFollowersLoading) {
            return <Spinner />
        }
        return (
            <Grid container justifyContent="center">
                <GeneralChart
                    id="contacts"
                    categories={["Followers", "Follows"]}
                    values={[totalFollowers || 0, totalFollows || 0]}
                    width={500}
                />
            </Grid>
        )
    }

    const hasMoreFollows = !follows?.length || totalFollows>follows?.length;
    const hasMoreFollowers = !followers?.length || totalFollowers>followers?.length;

    console.log({ totalFollowers, totalFollows, currFollowers: followers?.length, currFollows: follows?.length, hasMoreFollowers, hasMoreFollows })

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                { renderChart() }
            </Grid>
            <Grid item md={6} xs={12}>
                <Typography variant="h6" align="center" paddingBottom={1}>
                    Followers
                </Typography>
                <Results
                    data={followers}
                    isLoading={false}
                    noMore={true}
                    onNextPage={()=>{}}
                    keyword="followers"
                    oneComponent={
                        <UserCard />
                    }
                />
                {hasMoreFollowers &&
                    <Grid container justifyContent={"center"}>
                        <NavLink to={user?.html_url || "/"}>See all followers</NavLink>
                    </Grid>
                }
            </Grid>
            <Grid item md={6} xs={12}>
                <Typography variant="h6" align="center" paddingBottom={1}>
                    Follows
                </Typography>
                <Results
                    data={follows}
                    isLoading={false}
                    noMore={true}
                    onNextPage={()=>{}}
                    keyword="follows"
                    oneComponent={
                        <UserCard />
                    }
                />
                {hasMoreFollows &&
                    <Grid container justifyContent={"center"}>
                        <NavLink to={user?.html_url || "/"}>See all follows</NavLink>
                    </Grid>
                }
            </Grid>
        </Grid>
    )

}