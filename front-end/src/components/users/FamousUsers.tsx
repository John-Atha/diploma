import React from 'react'
import { useQuery } from 'react-query'
import { queriesKeys } from '../../api/queriesKeys'
import { getFamousUsers } from '../../api/user'
import { ExploreUserCard } from './ExploreUserCard'
import { CarouselResults } from "../general/CarouselResults";

export const FamousUsers = () => {
    const { data, isLoading } = useQuery(
        queriesKeys['getFamousUsers'],
        () => getFamousUsers({ limit: 10 }), {
            cacheTime: 100000,
            refetchOnWindowFocus: false,
        }
    )

    return (
        <CarouselResults
            data={data?.items}
            isLoading={isLoading}
            title="Most followed users"
            width={400}
            oneResultComponent={
                <ExploreUserCard />
            }
        />
    )
}