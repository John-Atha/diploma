import React from 'react'
import { selectSearchUser } from '../../redux/slices/searchUser'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-query'
import { queriesKeys } from '../../api/queriesKeys'
import { getStarredRepos } from '../../api/user'
import Spinner from '../general/Spinner'
import { Grid, Paper, Typography } from '@mui/material'
import { OneRepoRow } from './OneRepoRow'
import { StarOutlined } from '@mui/icons-material'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

export const StarredRepos = () => {
    const { user } = useSelector(selectSearchUser);

    const { data, isLoading } = useQuery(
        [queriesKeys['getStarredRepos'], user?.login],
        () => getStarredRepos({ username: user?.login }), {
            enabled: !!user?.login,
            refetchOnWindowFocus: false,
        },
    );


    let content = null;

    if (isLoading) {
        content = <Spinner />;
    }
    else if (!data?.length) {
        return null;
    }
    else {
        content = (
            <Grid container rowSpacing={1} paddingRight={3}>
                {data.map((repo: any) => (
                    <Grid item xs={12}>
                        <OneRepoRow {...repo} />
                    </Grid>
                ))}
            </Grid>
        )
    }

    return (
        <Paper sx={{ padding: 1, paddingTop: 2 }}>
            <Grid container alignItems="center" rowSpacing={2}>
                <Grid item xs={12}>
                    <Grid container>
                        <Typography variant="body1" fontWeight={600} align="center">
                            Starred Repos
                        </Typography>
                        <StarOutlined fontSize='small' />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <SimpleBar style={{ maxHeight: 300 }}>
                        { content }
                    </SimpleBar>
                </Grid>
            </Grid>

        </Paper>
    )
}