import React, { ReactElement } from 'react'
import MySidebar from '../components/general/MySidebar'
import { SnackMessage } from '../components/general/SnackMessage'

interface SkeletonProps {
    children: ReactElement | ReactElement[],
}

export const PageSkeleton = ({ children }: SkeletonProps) => {
    return (
        <>
            <MySidebar children={children} />
            <SnackMessage />
        </>
    )
}