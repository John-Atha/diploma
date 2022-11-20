import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Repos } from '../components/repos/Repos';
import { SearchPage } from '../components/search/SearchPage';
import { OneRepository } from './OneRepository';
import { PageSkeleton } from './PageSkeleton';

export const Repositories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState(0);

  if (searchParams.get("key") && searchParams.get("repo")) {
    return <OneRepository />
  }

  return (
    <PageSkeleton
      children={
        <SearchPage
          placeholder={"Search for a user..."}
          resultsComponent={
            <Repos
              value={searchParams.get("key") || ""}
            />
          }
        />
      }
    />
  );
}
