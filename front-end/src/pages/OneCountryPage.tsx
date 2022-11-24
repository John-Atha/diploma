import { Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { PageSkeleton } from "./PageSkeleton";

export const OneProductionCountry = () => {
    const { iso_3166_1 } = useParams();
    return (
        <PageSkeleton>
            <Typography variant="h6">
                lalla {iso_3166_1}
            </Typography>
        </PageSkeleton>
    )
};
