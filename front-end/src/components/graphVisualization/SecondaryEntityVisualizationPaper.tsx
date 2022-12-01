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
  keyValue?: string;
  entityName?: string;
  clear: () => void;
}

export const SecondaryEntityVisualizationPaper = ({
  keyValue,
  entityName,
  clear,
}: MovieVisualizationPaperProps) => {
  console.log(entityName, keyValue);
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
            <Typography variant="body2">Node</Typography>
            <IconButton onClick={clear}>
              <Close />
            </IconButton>
          </Grid>
          <Typography variant="body1">{data.name}</Typography>
          <Typography variant="body2">{data.movies_count} Movies</Typography>
          <Chip variant="filled" color="warning" size="small" label={entityName} sx={{ width: 100 }} />
        </>
      )}
      {!isLoading && !data && (
        <Alert severity="info">
            Node not found
        </Alert>
      )}
    </Stack>
  );
};
