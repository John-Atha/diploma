import React, { useEffect, useState } from 'react'
import { UsernameProps } from '../repos/Repos'
import { selectSearchUser } from '../../redux/slices/searchUser'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-query'
import { queriesKeys } from '../../api/queriesKeys'
import { getUserCommitsByMonth, getUserOneCommit } from '../../api/commits'
import moment from 'moment'
import { getUser } from '../../api/user'
import { Paper, Typography } from '@mui/material'
import { GeneralChart } from '../charts/GeneralChart'
import { DiagramPaper } from './DiagramPaper'

export const CommitsArea = ({ value: username }: UsernameProps) => {
    const { user } = useSelector(selectSearchUser);
    const [start, setStart] = useState<any>(null);
    const [end, setEnd] = useState<any>(null);

    const [keys, setKeys] = useState<string[]>([]);
    const [values, setValues] = useState<number[]>([])

    // const { data: firstCommit, isLoading: firstCommitLoading } = useQuery(
    //     [queriesKeys['getFirstCommit'], username, 'first'],
    //     () => getUserOneCommit({ username: username || "", order: 'asc'}), {
    //         enabled: !!username,
    //         cacheTime: 10000,
    //     }
    // );
    
    const [firstCommit, setFirstCommit] = useState({
        items: [
            {
                commit: {
                    author: {
                        date: "2020-11-16T12:37:44.000+02:00"
                    }
                }
            }
        ]
    })
    const [firstCommitLoading, setFirstCommitLoading] = useState(false);

    const [lastCommit, setLastCommit] = useState({
        items: [
            {
                commit: {
                    author: {
                        date: "2022-05-16T12:37:44.000+02:00"
                    }
                }
            }
        ]
    })
    const [lastCommitLoading, setLastCommitLoading] = useState(false);


    // const { data: lastCommit, isLoading: lastCommitLoading } = useQuery(
    //     [queriesKeys['getLastCommit'], username, 'last'],
    //     () => getUserOneCommit({ username: username || "", order: 'desc'}), {
    //         enabled: !!username,
    //         cacheTime: 10000,
    //     }
    // );

    interface CountByMonthProps {
        username: string,
        year: number,
        month: number,
    }

    const countByMonth = async ({ username, year, month }: CountByMonthProps) => {
        let counter = 0;
        try {
            const data = await getUserCommitsByMonth({ username, year, month });
            counter = data?.total_count || 0;
        }
        catch(err: any) {
            console.log(err);
        }
        console.log(counter)
        return counter;
    }

    useEffect(() => {
        if (firstCommit && !firstCommitLoading) {
            const { items } = firstCommit as any;
            const start_ = moment(items?.[0]?.commit?.author?.date);
            setStart({ month: start_.month() , year: start_.year() })
        }
    }, [firstCommit, firstCommitLoading])

    useEffect(() => {
        if (lastCommit && !lastCommitLoading) {
            const { items } = lastCommit as any;
            const end_ = moment(items?.[0]?.commit?.author?.date);
            setEnd({ month: end_.month() , year: end_.year() })
        }
    }, [lastCommit, lastCommitLoading])

    useEffect(() => {
        console.log({ start, end })
        if (start && end) {
            const dates = [start];
            let date = { ...start };
            while ((date.year<end.year) || (date.year<=end.year && date.month<=end.month)) {
                const next = moment(date).add(1, "month");
                const next_obj = { month: next.month(), year: next.year() };
                dates.push(next_obj);
                date = next_obj;
            }
            const ys: number[] = [];
            dates.forEach(async ({ month, year }: any) => {
                // const counter = await (!!username ? countByMonth({ username, year, month}) : 0);
                const counter = Math.round(Math.random()*100);
                ys.push(counter);
            })
            console.log({ dates});
            console.log(ys);
            setKeys(dates.map(({ month, year }: any) => moment({ month, year }).format("MM/YYYY")));
            setValues(ys);
        }
    }, [start, end])

    return (
        <DiagramPaper
            title="Monthly Commits"
            keys={keys}
            values={values}
            type="area"
            id="monthly-commits"
            isLoading={firstCommitLoading || lastCommitLoading}
            showAllKeys={false}
            chartWidth={"100%"}
        />
    )

}