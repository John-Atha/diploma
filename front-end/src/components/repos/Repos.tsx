import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { queriesKeys } from '../../api/queriesKeys'
import { getRepos } from '../../api/repos'
import { OneRepo } from './OneRepo'
import { pagiStep } from '../../api/config';
import { Results } from '../general/Results';

export interface UsernameProps {
    value?: string,
}

export const Repos = ({ value: username }: UsernameProps) => {
    const [page, setPage] = useState(1);
    const [all, setAll] = useState<any>([]);
    const [noMore, setNoMore] = useState(false);

    const { data, isLoading } = useQuery(
        [queriesKeys['getRepos'], page, username],
        () => getRepos({ username, page }), {
            enabled: Boolean(username),
            cacheTime: 10000,
            refetchOnWindowFocus: false,
        }
    )

    useEffect(() => {
        setPage(1);
    }, [username])

    useEffect(() => {
        if (isLoading) return;
        let temp = [];
        if (data?.length) {
            const existingIds = new Set(all.map(({ id }: any) => id));
            const new_data = data.filter(({ id }: any) => !existingIds.has(id));
            temp = all.concat(new_data);
        }
        setAll(temp.filter(({ owner: { login }}: any) => login.toLowerCase()===username?.toLowerCase()))
        setNoMore(data?.length<pagiStep);
    }, [data])

    return (
        <Results
            data={all}
            isLoading={isLoading}
            noMore={noMore}
            onNextPage={()=>setPage(page+1)}
            keyword="repositories"
            oneComponent={
                <OneRepo />
            }
        />
    )
}