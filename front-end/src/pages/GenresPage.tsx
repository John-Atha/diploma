import { Grid, Stack } from "@mui/material";
import useMeasure from "react-use-measure";
import {
  OneSecondaryEntity,
  placeholderSecondaryEntity,
} from "../components/general/OneSecondaryEntity";
import { SecondaryEntitiesList } from "../components/general/SecondaryEntitiesList";
import { TopGenresMovies } from "../components/genres/TopGenresMovies";
import { PageSkeleton } from "./PageSkeleton";

export const GenresPage = () => {
  const [ref, bounds] = useMeasure();

  return (
    <PageSkeleton
      children={
        <>
          <div ref={ref} />
          <Stack spacing={2} width={bounds.width}>
            <TopGenresMovies />
            <SecondaryEntitiesList
              name="Genres"
              component={<OneSecondaryEntity {...placeholderSecondaryEntity} width={200} />}
            />
          </Stack>
        </>
      }
    />
  );
};
