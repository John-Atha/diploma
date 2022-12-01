import { Close } from "@mui/icons-material";
import {
  Alert,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";
import { getOneEntity } from "../../api/general";
import { queriesKeys } from "../../api/queriesKeys";
import Spinner from "../general/Spinner";

interface MovieVisualizationPaperProps {
  keyValue?: string;
  entityName?: string;
  clear: () => void;
}

export const SecondaryEntityVisualizationPaper = ({
  keyValue,
  entityName,
  clear,
}: MovieVisualizationPaperProps) => {
  const { data, isLoading } = useQuery(
    [queriesKeys.getOneEntity(entityName as string), keyValue],
    () => getOneEntity(entityName as string, keyValue as string),
    {
      enabled: !!keyValue,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Stack
      component={Paper}
      spacing={1}
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        borderRadius: 0,
        width: 300,
        height: "100%",
        padding: 2,
      }}
    >
      {isLoading && <Spinner />}
      {!isLoading && !!data && (
        <>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography variant="body2">Node</Typography>
                </Grid>
                <Grid item>
                  <Chip
                    variant="filled"
                    color="warning"
                    size="small"
                    label={entityName}
                    sx={{ width: 150 }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton onClick={clear}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>
          <Typography variant="body1">
            {data.name ||
              data.data?.fields?.title ||
              data.data?.fields?.original_title}
          </Typography>
          {!!data.movies_count && (
            <Typography variant="body2">{data.movies_count} Movies</Typography>
          )}
          {/* if is movie */}
          {!!data.data?.fields && (
            <>
              <Typography variant="body2">
                {data.data?.fields.release_date}
              </Typography>
              <Typography variant="body2">
                {data.data?.fields.tagline}
              </Typography>
              <Typography variant="body2">
                {data.data?.fields.overview}
              </Typography>
            </>
          )}
          <NavLink to={`/${entityName}/${keyValue}`}>Explore</NavLink>
        </>
      )}
      {!isLoading && !data && <Alert severity="info">Node not found</Alert>}
    </Stack>
  );
};
