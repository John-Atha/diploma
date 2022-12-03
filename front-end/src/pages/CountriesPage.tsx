import { Grid, Stack } from "@mui/material";
import { useEffect } from "react";
import useMeasure from "react-use-measure";
import { ProductionCountriesMap } from "../components/countries/ProductionCountriesMap";
import { MyHeader } from "../components/general/MyHeader";
import { TopGeneralEntities } from "../components/generalEntityPage/TopGeneralEntities";
import { useAppDispatch } from "../redux/hooks";
import { setRoutes } from "../redux/slices/breadCrumbSlice";
import { PageSkeleton } from "./PageSkeleton";

export const CountriesPage = () => {
  const [ref, bounds] = useMeasure();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setRoutes({
        routes: [
          {
            text: "MovieOn",
            href: "/",
          },
          {
            text: "Production Countries",
            href: "#",
          },
        ],
      })
    );
  }, []);

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
                  placeholder: `Search for a country...`,
                  entityName: "ProductionCountries",
                }}
              />{" "}
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
