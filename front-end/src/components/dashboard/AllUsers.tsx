import { useTheme } from '@mui/system'
import React, { cloneElement, ReactElement } from 'react'
import { useQuery } from 'react-query';
import { queriesKeys } from '../../api/queriesKeys';
import { getAllUsers } from '../../api/user'
import { SimpleCard } from '../general/SimpleCard';
import Spinner from '../general/Spinner';

interface AllUsersProps {
    type?: string,
    severity?: "primary" | "info" | "success" | "warning" | "error",
    subtitle?: string,
    icon: ReactElement,
}

export const AllUsers = ({
    type="User",
    severity="primary",
    subtitle="Users",
    icon,
}:AllUsersProps) => {
    const theme = useTheme();
    const { data, isLoading } = useQuery(
        [queriesKeys['getAllUsers'], type],
        () => getAllUsers({ type }), {
            cacheTime: 1000000,
            refetchOnWindowFocus: false,
        },
    );

    if (isLoading) {
        return (
            <Spinner />
        )
    }

    if (!data) {
        return null;
    }

    const counter = data.total_count || 0;
    return (
        <SimpleCard
            subtitle={subtitle}
            title={`${counter}`}
            icon={
                cloneElement(
                    icon, {
                        htmlColor: theme.palette[severity].main
                    }
                )
            }
            severity={severity}
            href="users"
        />
    )

}