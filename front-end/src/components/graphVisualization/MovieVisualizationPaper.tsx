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
import { getOneEntity } from "../../api/general";
import { queriesKeys } from "../../api/queriesKeys";
import Spinner from "../general/Spinner";

interface MovieVisualizationPaperProps {
  movie_id?: number;
  clear: () => void;
}

export const MovieVisualizationPaper = ({
  movie_id,
  clear,
}: MovieVisualizationPaperProps) => {
  const { data, isLoading } = useQuery(
    [queriesKeys.getOneEntity("movie"), movie_id],
    () => getOneEntity("movies", `${movie_id}`),
    {
      enabled: !!movie_id,
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
            <Typography variant="body2">Node</Typography>
            <IconButton onClick={clear}>
              <Close />
            </IconButton>
          </Grid>
          <Typography variant="body1">{data.data?.fields?.title}</Typography>
          <Typography variant="body2">{data.data?.fields?.release_date}</Typography>
          <Chip
            variant="filled"
            color="success"
            label="Movie"
            sx={{ width: 100 }}
          />
        </>
      )}
      {!isLoading && !data && <Alert severity="info">Node not found</Alert>}
    </Stack>
  );
};
