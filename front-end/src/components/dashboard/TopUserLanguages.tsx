import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { queriesKeys } from '../../api/queriesKeys';
import { get100LatestRepos } from '../../api/repos';
import { selectSearchUser } from '../../redux/slices/searchUser';
import { UsernameProps } from '../repos/Repos'
import { DiagramPaper } from './DiagramPaper';

interface PaperProps {
    value: string,
    width: number | string,
}

export const TopUserLanguages = ({ value: username, width }: PaperProps) => {
    const { user } = useSelector(selectSearchUser);
    const [values, setValues] = useState([]);

    const { data, isLoading } = useQuery(
        [queriesKeys['getLatestRepos'], username],
        () => get100LatestRepos({ username }), {
            enabled: !!username,
            cacheTime: 10000,
            refetchOnWindowFocus: false,
        }
    );

    useEffect(() => {
        if (data && !isLoading) {
            const counters: any = {};
            data.forEach(({ language }: any) => {
                if (!language) return;
                if (counters[language]) {
                    counters[language] += 1;
                }
                else {
                    counters[language] = 1;
                }
            });
            setValues(counters);
        }
    }, [data, isLoading])


    return (
        <DiagramPaper
            title="Top Languages"
            keys={Object.keys(values||{})}
            values={Object.values(values||{})}
            id="top-langs"
            type="pie"
            isLoading={isLoading}
            showAllKeys={true}
            chartWidth={width}
        />
    )
}