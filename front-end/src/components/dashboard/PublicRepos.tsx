import React from 'react';
import { FolderOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/system';
import { useSelector } from 'react-redux'
import { selectSearchUser } from '../../redux/slices/searchUser'
import { SimpleCard } from '../general/SimpleCard';


export const PublicRepos = () => {
    const theme = useTheme();
    const { user } = useSelector(selectSearchUser);
    const repos = user?.public_repos;

    return (
        <SimpleCard
            subtitle={"Public repos"}
            title={`${repos}` || '0'}
            icon={
                <FolderOutlined
                    htmlColor={theme.palette.primary.main}
                />
            }
            severity="primary"
            href={"repos"}
        />
    )
}