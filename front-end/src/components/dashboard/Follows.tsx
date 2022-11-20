import React from 'react'
import { GroupAddOutlined, GroupOutlined } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { selectSearchUser } from '../../redux/slices/searchUser'
import { SimpleCard } from '../general/SimpleCard'
import { useTheme } from '@mui/system'


export const Follows = () => {
    const theme = useTheme();
    const { user } = useSelector(selectSearchUser);
    const follows = user?.following;   

    return (
        <SimpleCard
            subtitle={"Following"}
            title={`${follows}` || '0'}
            icon={
                <GroupAddOutlined
                    htmlColor={theme.palette.warning.main}
                />
            }
            severity="warning"
            href="contacts"
        />
    )
}