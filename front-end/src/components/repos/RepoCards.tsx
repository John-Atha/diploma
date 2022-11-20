import { CodeOutlined, CommitOutlined, StarOutlined, VisibilityOutlined } from '@mui/icons-material'
import { Grid, useTheme } from '@mui/material'
import React from 'react'
import { SimpleCard } from '../general/SimpleCard'
import { ExploreUserCard } from '../users/ExploreUserCard'
import { OneRepoProps } from './OneRepo'

export const RepoCards = ({
    stargazers_count,
    watchers,
    default_branch,
    language,
    owner,
    html_url,
}: OneRepoProps) => {
    const theme = useTheme();
    return (
        <Grid container spacing={1} justifyContent={"center"}>
            <Grid item marginTop={0.5}>
                <ExploreUserCard
                    {...owner}
                    height={150}
                />
            </Grid>
            <Grid item>
                <SimpleCard
                    subtitle='Stars'
                    title={stargazers_count || 0}
                    icon={
                        <StarOutlined
                            htmlColor={theme.palette.primary.main}
                        />
                    }
                    severity='primary'
                    href="#"
                />
            </Grid>
            <Grid item>
                <SimpleCard
                    subtitle='Watchers'
                    title={watchers || 0}
                    icon={
                        <VisibilityOutlined
                            htmlColor={theme.palette.info.main}
                        />
                    }
                    severity='info'
                    href="#"
                />
            </Grid>
            <Grid item>
                <SimpleCard
                    subtitle='Default Branch'
                    title={default_branch}
                    icon={
                        <CommitOutlined
                            htmlColor={theme.palette.warning.main}
                        />
                    }
                    severity='warning'
                    href="#"
                />
            </Grid>
            <Grid item>
                <SimpleCard
                    subtitle='See source code'
                    title={language}
                    icon={
                        <CodeOutlined
                            htmlColor={theme.palette.error.main}
                        />
                    }
                    severity='error'
                    href={html_url || "#"}
                />
            </Grid>
        </Grid>
    )

}