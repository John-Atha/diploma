import React, { useEffect, useState } from 'react'
import { useGetLanguageRepos } from "../../hooks/useGetLanguageRepos";
import { Chip, Rating, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { OwnerAvatar } from '../repos/OwnerAvatar';

interface LanguageTabProps {
    lang: string,
}

export const LanguageTab = ({ lang }: LanguageTabProps) => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
        },
        {
            field: 'owner',
            headerName: 'Owner',
            flex: 1,
            renderCell: (params: any) => {
                const owner = params.row.owner;
                return (
                    <OwnerAvatar
                        username={owner.login}
                        avatar_url={owner.avatar_url}
                        height={20}
                        width={20}
                    />
                )
            }
        },
        {
            field: 'stargazers_count',
            headerName: 'Stars',
            width: 150,
            renderCell: (params: any) => {
                const rating = params.row.stargazers_count;
                return (
                    <Rating
                        precision={0.25}
                        value={rating/20000}
                        readOnly
                        size="small"
                    />
                )
            }
        },
        {
            field: 'watchers_count',
            headerName: 'Watchers',
            innerWidth: 100,
        },
        {
            field: 'forks',
            headerName: 'Forks',
            innerWidth: 100,
        },
        {
            field: 'size',
            headerName: 'Size',
            innerWidth: 100,
            renderCell: (params: any) => {
                console.log({ params });
                const size = params.row.size;
                return (
                    <Chip
                        color={size<5000 ? "info" : (size<7000 ? "warning" : "success")}
                        label={size<5000 ? "small" : (size<9000 ? "medium" : "large")}
                        variant="outlined"
                        size="small"
                    />
                );
            }
        },
    ]
    const [rows, setRows] = useState([]);
    const { data, isLoading } = useGetLanguageRepos({ lang, page, per_page: perPage });

    const getRowFromDatum = ({
        name,
        owner,
        stargazers_count,
        watchers_count,
        forks,
        size,
    }: any) => {
        return ({
            id: name,
            name,
            owner,
            stargazers_count,
            watchers_count,
            forks,
            size,
        })
    }

    useEffect(() => {
        if (data?.items && !isLoading) {
            setRows(data?.items?.map((datum: any) => (
                getRowFromDatum(datum)
            )));
            if(!total) setTotal(data.total_count);
        }
    }, [data, isLoading])
    
    return (
        <DataGrid
            density='compact'
            rows={rows || []}
            columns={columns}
            loading={isLoading}
            autoHeight

            pageSize={perPage}
            rowsPerPageOptions={[5, 10, 15]}
            rowCount={Math.floor(total/perPage)+1}
            pagination
            paginationMode='server'

            onPageChange={(page: number) => setPage(page)}
            onPageSizeChange={(size: number) => setPerPage(size)}
        />
    )


}