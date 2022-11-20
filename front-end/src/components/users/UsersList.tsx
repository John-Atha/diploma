import { Alert, Grid } from '@mui/material'
import React from 'react'
import { Results } from '../general/Results'
import { OneUser, UserCard } from './UserCard'

interface Users {
    users: OneUser[],
    keyword?: string,
    isLoading: boolean,
    noMore: boolean,
    onNextPage: () => void,
}
// export const UsersList = ({
//     users,
//     isLoading,
//     noMore,
//     keyword='users',
//     onNextPage
// }: Users) => {
//     return (
//         <Results
//             data={users}
//             isLoading={isLoading}
//             noMore={noMore}
//             onNextPage={onNextPage}
//             oneComponent={
//                 <UserCard />
//             }
//         />
//     )    
//     if (!users?.length) {
//         return (
//             <Alert severity='info'>
//                 No {keyword} found
//             </Alert>
//         )
//     }
//     return (
//         <Grid container spacing={2}>
//             {users.map((user) => (
//                 <Grid item key={user?.id} minWidth={150}>
//                     <UserCard {...user} />
//                 </Grid>
//             ))}
//         </Grid>
//     )
// }