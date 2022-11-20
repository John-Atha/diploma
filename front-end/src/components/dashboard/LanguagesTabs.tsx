import { Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { langs } from '../../data/langs'
import { Tabs } from '../general/Tabs'
import { LanguageTab } from './LanguageTab'

export const LanguagesTabs = () => {

    const [tabs, setTabs] = useState(
        langs.map((lang: string, index: number) => ({
            value: index.toString(),
            label: lang,
            content: <LanguageTab lang={lang} />
        }))
    )

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6" align="center">
                    Top repos per language
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Tabs tabs={tabs} />
            </Grid>
        </Grid>
    )
}