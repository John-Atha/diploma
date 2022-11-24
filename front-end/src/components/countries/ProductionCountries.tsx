import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getEntities } from "../../api/general";
import { queriesKeys } from "../../api/queriesKeys";
import countries_data from "../../data/custom.geo.json";

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
  movies_count: number;
}

export const ProductionCountries = () => {
  const [countries, setCountries] = useState(countries_data);
  const [avgCountryMovies, setAvgCountryMovies] = useState(1);
  const [focusedCountry, setFocusedCountry] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery(
    [queriesKeys.getEntities("productionCountries")],
    () => getEntities({ name: "productionCountries", page: 1, size: -1 }),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  const countryStyle = (feature: any) => {
    let mapStyle = {
      fillColor: "green",
      weight: 1,
      fillOpacity:
        1 -
        (avgCountryMovies - (feature.properties.movies_count || 0)) /
          avgCountryMovies,
      color: "#b5b345",
      dashArray: "3",
    };
    return mapStyle;
  };

  const highlightFeature = (e: any) => {
    setFocusedCountry(e.target.feature.properties);
  };

  const resetHighlight = () => {
    setFocusedCountry(null);
  };

  const closeDialog = () => setSelectedCountry(null);

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: () => setSelectedCountry(feature.properties),
    });
  };

  useEffect(() => {
    if (!!data?.["data"] && !isLoading) {
      let counts: number[] = [];
      // add the movies_count to each country of the geo json
      const enrichedCountries = countries_data;
      data.data.forEach(({ iso_3166_1, movies_count }: ProductionCountry) => {
        const countryIndex = enrichedCountries.features.findIndex(
          ({ properties: { iso_a2 } }) => `${iso_a2}` === iso_3166_1
        );
        if (countryIndex === -1) return;
        const country = enrichedCountries.features[countryIndex];
        counts.push(movies_count);
        const enrichedCountry: any = { ...country };
        enrichedCountry.properties.movies_count = movies_count;

        enrichedCountries.features.splice(countryIndex, 1);
        enrichedCountries.features.push(enrichedCountry);
      });
      setCountries(enrichedCountries);
      setAvgCountryMovies(Math.max(...counts) * 0.1);
    }
  }, [data, isLoading, countries_data]);

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Production countries map</Typography>
      <MapContainer
        center={[37.98381, 23.727539]}
        zoom={2}
        maxZoom={4}
        minZoom={1}
        scrollWheelZoom
        style={{ height: 500 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={countries as any}
          style={countryStyle}
          onEachFeature={onEachFeature}
        />
        {!!focusedCountry && (
          <Paper
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              zIndex: 400,
              padding: 1,
              minWidth: 200,
            }}
            component={Stack}
            spacing={1}
          >
            <Typography variant="h6">{focusedCountry?.name_long}</Typography>
            <Divider />
            <Typography variant="body1">
              {focusedCountry?.movies_count || 0} Movies Produced
            </Typography>
          </Paper>
        )}
      </MapContainer>
      {!!selectedCountry && (
        <Dialog open onClose={closeDialog}>
          <DialogTitle>{selectedCountry.name_long}</DialogTitle>
          <DialogContent>
            Would you like to see the movies produced in {selectedCountry.name_long}?
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={closeDialog}>Cancel</Button>
            <Button variant="contained" onClick={() => navigate(`/countries/${selectedCountry.iso_a2}`)}>OK</Button>
          </DialogActions>
        </Dialog>
      )}
    </Stack>
  );
};
