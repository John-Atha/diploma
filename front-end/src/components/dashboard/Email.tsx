import { EmailOutlined, FeedOutlined } from '@mui/icons-material'
import { useTheme } from '@mui/system'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectSearchUser } from '../../redux/slices/searchUser'
import { SimpleCard } from '../general/SimpleCard'
import TwitterIcon from '@mui/icons-material/Twitter';

export const Email = () => {
    const theme = useTheme();
    const { user } = useSelector(selectSearchUser);

    const { email, twitter_username, blog } = user || {};
    const htmlColor = theme.palette.error.main;

    let name = "";
    let field = "";
    let icon = null;

    if (email) {
        name = "Mail";
        field = email;
        icon = <EmailOutlined htmlColor={htmlColor} />
    }
    else if (twitter_username) {
        name = "Twitter";
        field = twitter_username;
        icon = <TwitterIcon htmlColor={htmlColor} />
    }
    else if (blog) {
        name = "Blog";
        field = blog;
        icon = <FeedOutlined htmlColor={htmlColor} />
    }

    if (name) {
        return (
            <SimpleCard
                title={name}
                subtitle={field}
                icon={icon}
                severity="error"
                href="#"
            />
        )
    }
    return null;
}