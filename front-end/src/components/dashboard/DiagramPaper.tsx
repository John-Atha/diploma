import React from 'react'
import { Grid, Paper, Typography } from '@mui/material'
import { GeneralChart } from '../charts/GeneralChart'
import Spinner from '../general/Spinner'

interface DiagramPaperProps {
    title: string,
    keys: string[],
    values: number[],
    id: string,
    type: any,
    isLoading?: boolean,
    showAllKeys?: boolean,
    chartWidth: number | string,
}

export const DiagramPaper = ({
    title,
    keys,
    values,
    id,
    type,
    isLoading=false,
    showAllKeys=true,
    chartWidth,
}: DiagramPaperProps) => {
    let content = <Spinner />

    if (!isLoading && !keys?.length) {
        return null;
    }
    
    if (!isLoading) {
        content = (
            <GeneralChart
                categories={
                    keys.map(
                        (key, index) => {
                            if (showAllKeys || index%3==0) {
                                return key
                            } else {
                                return ""
                            }
                        }
                    )
                }
                values={values}
                type={type}
                id={id}
                width={chartWidth}
            />
        )
    }
    return (
        <Paper
            sx={{
                padding: 1,
                width: 1,
                height: 1
            }}
            component={Grid}
            container
            alignItems="center"
            justifyContent="center"
        >
            <Grid item xs={12}>
                <Typography variant="body1" fontWeight={600} align="center">
                    {title}
                </Typography>
                {/* {JSON.stringify(keys)}
                {JSON.stringify(values)} */}
                { content }
            </Grid>
        </Paper>
    )
}