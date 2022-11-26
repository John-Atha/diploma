import { Grid, Stack } from "@mui/material";
import useMeasure from "react-use-measure";
import { ProductionCountriesMap } from "../components/countries/ProductionCountriesMap";
import { TopGeneralEntities } from "../components/generalEntityPage/TopGeneralEntities";
import { SearchBar } from "../components/search/SearchBar";
import { PageSkeleton } from "./PageSkeleton";

export const CountriesPage = () => {
  const [ref, bounds] = useMeasure();

  return (
    <PageSkeleton
      children={
        <>
          <div ref={ref} />
          <Stack spacing={2} width={bounds.width}>
            <Grid item xs={12}>
              <SearchBar initValue="" placeholder={`Search for a country...`} />
            </Grid>
            <TopGeneralEntities
              entityName="productioncountries"
              keyField="iso_3166_1"
              headerName="Production Countries"
            />
            <ProductionCountriesMap />
          </Stack>
        </>
      }
    />
  );
};
