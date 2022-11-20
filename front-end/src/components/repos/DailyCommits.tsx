import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { queriesKeys } from '../../api/queriesKeys'
import { GetRepoDailyCommits, GetRepoProps } from '../../api/repos'
import { days } from '../../data/days'
import { DiagramPaper } from '../dashboard/DiagramPaper'

export const DailyCommits = ({ username, repoName }: GetRepoProps) => {
    const [values, setValues] = useState<number[]>([]);
    const keys = days;
    const { data, isLoading } = useQuery(
        [queriesKeys['getRepoDailyCommits'], username, repoName],
        () => GetRepoDailyCommits({ username, repoName }), {
            enabled: !!username && !!repoName,
            refetchOnWindowFocus: false,
        },
    );

    const getDaysStats = () => {
        const counters: any = {};
        console.log({ data });
        data?.forEach(({ days }: any) => {
            console.log({ days });
            days.forEach((dayCounter: number, index: number) => {
                if (dayCounter) console.log({ dayCounter })
                if (counters[index]===undefined) {
                    counters[index] = 0;
                }
                else {
                    counters[index] += dayCounter;
                }
            })
        })
        return Object.values(counters) as number[];
    }

    useEffect(() => {
        if (!isLoading && data && (data.constructor.name == "Array")) {
            setValues(getDaysStats());
            console.log({ stats: getDaysStats() })
        } 
    }, [data, isLoading])

    if (!values?.length) return null;
    
    return (
        <DiagramPaper
            title="Daily Commits"
            keys={keys}
            values={values}
            type="pie"
            id="daily-repo-commits"
            isLoading={isLoading}
            showAllKeys={true}
            chartWidth={"100%"}
        />
    )
}