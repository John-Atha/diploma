import React from 'react';
import { Grid } from '@mui/material';
import { PageSkeleton } from './PageSkeleton';
import { FamousUsers } from '../components/users/FamousUsers';
import { FamousRepos } from '../components/repos/FamousRepos';
import { AllUsers } from '../components/dashboard/AllUsers';
import { PersonOutlined, WarehouseOutlined } from '@mui/icons-material';
import { TopLanguages } from '../components/dashboard/TopLanguages';
import { LanguagesTabs } from '../components/dashboard/LanguagesTabs';

export const App = () => {

  return (
    <PageSkeleton>
      <Grid container rowSpacing={2} justifyContent="center">
        <Grid item>
          <FamousRepos />
        </Grid>
        <Grid item md={6} xs={12}>
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
        </Grid>
      </Grid>
    </PageSkeleton>
  );
}
