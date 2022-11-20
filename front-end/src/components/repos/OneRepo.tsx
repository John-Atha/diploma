import React from 'react'
import { alpha, Button, Card, CardActions, CardContent, Grid, Paper, Rating, Typography, useTheme } from "@mui/material";
import { stringSlice } from '../../helpers/stringSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import { OwnerAvatar } from './OwnerAvatar';
import { Tags } from './Tags';
import { useQuery } from 'react-query';
import { queriesKeys } from '../../api/queriesKeys';
import { getRepoParticipation } from '../../api/repos';
import { Sparklines, SparklinesLine  } from 'react-sparklines';
import { arraySample } from '../../helpers/arraySample';
import { Star } from '@mui/icons-material';

export interface OneRepoProps {
    id?: number,
    name?: string,
    fullName?: string,
    description?: string,
    html_url?: string,
    topics?: string[],
    watchers?: number,
    owner?: any,
    stargazers_count?: number,
    keywordsLim?: number,
    descriptionLim?: number,
    height?: number,
    width?: number,
    default_branch?: string,
    language?: string,
}

export const OneRepo = ({
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
    keywordsLim=-1,
    descriptionLim=100,
    height,
    width,
    stargazers_count,
}: OneRepoProps) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const { data, isLoading } = useQuery(
        [queriesKeys['getRepoParticipation'], name],
        () => getRepoParticipation({ username: login, repoName: name }), {
            enabled: Boolean(login) && Boolean(name),
            cacheTime: 10000,
            refetchOnWindowFocus: false,
        }
    )

    const renderSparkLine = () => {
        if (isLoading || !data) {
            return null;
        }
        return (
            <Sparklines
                data={data.all}
                limit={data.all?.length || 10}
                svgWidth={50}
                svgHeight={20}
                margin={2}
            >
                <SparklinesLine color={theme.palette.primary.main} />
            </Sparklines>
        )
    }

    const renderRating = () => {
        return (
            <Grid container alignItems="center">
                <Typography variant='caption'>
                    {stargazers_count}
                </Typography>
                <Star htmlColor={theme.palette.primary.main} />
            </Grid>
        )
    }


    return (
        <Card
            component={Paper}
            elevation={3}
            sx={{
                width: width || 300,
                ...(height && { height }),
                ...(!height && { minHeight: 250 }),
                backgroundColor: alpha(theme.palette.primary.main, 0.03)
            }}
        >
            <Grid container minHeight={250} alignItems="space-between">
                <Grid item xs={12}>
                    <CardContent>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Typography
                                    variant="h6"
                                    component={NavLink}
                                    to={`/repos?key=${login}&repo=${name}`}
                                    sx={{
                                        textDecoration: "none",
                                        color: "black",
                                    }}
                                >
                                    {name}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Grid container spacing={1}>
                                    <Grid item>
                                        { renderSparkLine() }
                                    </Grid>
                                    <Grid item>
                                        { renderRating() }
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                        <OwnerAvatar username={login} avatar_url={avatar_url} href={owner_html_url} />
                        <Typography variant="body2" marginBottom={1}>
                            {stringSlice(description, descriptionLim)}
                        </Typography>
                        <Tags tags={
                            keywordsLim===-1 ? topics : arraySample({ array: topics, limit: keywordsLim })
                        } />
                    </CardContent>
                </Grid>
                <Grid item xs={12}>
                    <CardActions sx={{ height: 1 }}>
                        <Grid container height={1} alignItems="flex-end">
                            <Button size="small" onClick={()=>window.location.href=html_url}>
                                See more
                            </Button>
                        </Grid>
                    </CardActions>
                </Grid>
            </Grid>
        </Card>
    )
}
