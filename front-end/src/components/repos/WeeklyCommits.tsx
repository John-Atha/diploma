import React from 'react'
import { useQuery } from 'react-query'
import { queriesKeys } from '../../api/queriesKeys'
import { getRepoParticipation, GetRepoProps } from '../../api/repos'
import { DiagramPaper } from '../dashboard/DiagramPaper'

export const WeeklyCommits = ({ username, repoName }: GetRepoProps) => {
    const { data, isLoading } = useQuery(
        [queriesKeys['getRepoParticipation'], username, repoName],
        () => getRepoParticipation({ username: username||"", repoName: repoName||"" }), {
            enabled: !!username && !!repoName,
            refetchOnWindowFocus: false,
        },
    );

    let keys = data?.all?.map((value: any, index: number) => index);
    const values = data?.all;

    console.log({ data });

    return (
        <DiagramPaper
            title="Weekly Commits"
            keys={keys}
            values={values}
            type="area"
            id="weekly-repo-commits"
            isLoading={isLoading}
            showAllKeys={false}
            chartWidth={"100%"}
        />
    )
}