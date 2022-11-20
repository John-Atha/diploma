import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Contacts } from '../components/contacts/Contacts';
import { SearchPage } from '../components/search/SearchPage';
import { PageSkeleton } from './PageSkeleton';

export const ContactsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <PageSkeleton
      children={
        <SearchPage
          placeholder={"Search for a user..."}
          resultsComponent={
            <Contacts
              value={searchParams.get("key") || ""}
            />
          }
        />
      }
    />
  );
}
