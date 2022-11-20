import React from 'react'
import { GroupOutlined } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { selectSearchUser } from '../../redux/slices/searchUser'
import { SimpleCard } from '../general/SimpleCard'
import { useTheme } from '@mui/system'


export const Followers = () => {
    const theme = useTheme();
    const { user } = useSelector(selectSearchUser);
    const followers = user?.followers;   

    return (
        <SimpleCard
            subtitle={"Followers"}
            title={`${followers}` || '0'}
            icon={
                <GroupOutlined
                    htmlColor={theme.palette.info.main}
                />
            }
            severity="info"
            href="contacts"
        />
    )
}