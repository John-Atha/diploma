import React from 'react';
import { Grid } from '@mui/material';
import { PageSkeleton } from './PageSkeleton';
import { TopMovies } from '../components/movies/TopMovies';
import { LatestMovies } from '../components/movies/LatestMovies';

export const App = () => {

  return (
    <PageSkeleton>
      <Grid container rowSpacing={2} spacing={1} justifyContent="center">
        <Grid item xs={12}>
          <TopMovies />
        </Grid>
        <Grid item xs={12}>
          <LatestMovies />
        </Grid>
        {/* <Grid item md={6} xs={12}>
          <Grid container justifyContent={"center"}>
            <Grid item xs={12}>
              <AllUsers
                icon={<PersonOutlined />}
              />
              <AllUsers
                type="Org"
                subtitle="Organizations"
                severity='info'
                icon={<WarehouseOutlined />}
              />
            </Grid>
            <Grid item xs={12}>
              <FamousUsers />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12}>
          <TopLanguages />
        </Grid>
        <Grid item xs={12}>
          <LanguagesTabs />
        </Grid> */}
      </Grid>
    </PageSkeleton>
  );
}
