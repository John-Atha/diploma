import { Alert, Grid, useTheme } from '@mui/material';
import React from 'react'
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom'
import { queriesKeys } from '../api/queriesKeys';
import { getOneRepo } from '../api/repos';
import Spinner from '../components/general/Spinner';
import { DailyCommits } from '../components/repos/DailyCommits';
import { OneRepoBasicCard } from '../components/repos/OneRepoBasicCard';
import { RepoCards } from '../components/repos/RepoCards';
import { WeeklyCommits } from '../components/repos/WeeklyCommits';
import { PageSkeleton } from './PageSkeleton';
import { Tags } from "../components/repos/Tags";

export const OneRepository = () => {
    const theme = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();
    const repoName = searchParams.get("repo");
    const username = searchParams.get("key");

    const { data, isLoading, isError } = useQuery(
        [queriesKeys['getOneRepo'], repoName, username],
        () => getOneRepo({ username, repoName }), {
            enabled: !!username && !!repoName,
            refetchOnWindowFocus: false,
        }
    );

    if (isLoading) {
        return <Spinner />;
    }
    if (isError) {
        return (
            <Alert severity='info'>
                Repository not found
            </Alert>
        )
    }

    return (
        <PageSkeleton>
            <Grid container rowSpacing={1} justifyContent={"center"}>
                <Grid item xs={12}>
                    <OneRepoBasicCard
                        {...data}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Tags
                        tags={data?.topics || []}
                        centered
                    />
                </Grid>
                <Grid item xs={12}>
                    <RepoCards {...data} />
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1} justifyContent="center">
                        <Grid item>
                            <WeeklyCommits
                                username={username}
                                repoName={repoName}
                            />
                        </Grid>
                        <Grid item>
                            <DailyCommits
                                username={username}
                                repoName={repoName}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </PageSkeleton>
    )
}