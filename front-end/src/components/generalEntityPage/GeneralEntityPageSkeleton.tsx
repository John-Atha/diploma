import { Grid, Stack } from "@mui/material";
import useMeasure from "react-use-measure";
import { PageSkeleton } from "../../pages/PageSkeleton";
import { MyHeader } from "../general/MyHeader";
import {
  OneSecondaryEntity,
  placeholderSecondaryEntity,
} from "../general/OneSecondaryEntity";
import { SecondaryEntitiesList } from "../general/SecondaryEntitiesList";
import { SearchBar } from "../search/SearchBar";
import { TopGeneralEntities } from "./TopGeneralEntities";

export interface GeneralEntityPageSkeletonProps {
  name: string;
  searchName: string;
  keyField?: string;
  headerName?: string;
}

export const GeneralEntityPageSkeleton = ({
  name,
  searchName,
  keyField = "name",
  headerName,
}: GeneralEntityPageSkeletonProps) => {
  const [ref, bounds] = useMeasure();

  return (
    <PageSkeleton
      children={
        <>
          <div ref={ref} />
          <Stack spacing={2} width={bounds.width}>
            <Grid item xs={12}>
              <MyHeader
                searchProps={{
                  initValue: "",
                  placeholder: `Search for a ${searchName}...`,
                }}
              />
            </Grid>
            <TopGeneralEntities
              entityName={name}
              keyField={keyField}
              headerName={headerName || name}
            />
            <SecondaryEntitiesList
              name={name}
              component={
                <OneSecondaryEntity
                  {...placeholderSecondaryEntity}
                  width={250}
                />
              }
            />
          </Stack>
        </>
      }
    />
  );
};
