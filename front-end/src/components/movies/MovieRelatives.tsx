import {
  Chip,
  Grid,
  Paper,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SecondaryEntityProps } from "../general/OneSecondaryEntity";

export interface MovieRelativesProps {
  data: SecondaryEntityProps[];
  title: string;
  keyField: string;
  entityName: string;
}

export const MovieRelatives = ({
  data,
  title,
  entityName,
  keyField,
}: MovieRelativesProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  if (!data.length) return null;

  return (
    <Grid container component={Paper} flexDirection="column" direction="column" height={1} minHeight={150} padding={1}>
      <Grid item marginBottom={2}>
        <Typography variant="h6" align="center">
          {title}
        </Typography>
      </Grid>
      <Grid item xs />
      <Grid item>
        <Grid
          container
          justifyContent="center"
          alignItems="space-between"
          maxHeight={200}
          sx={{ overflowY: "auto" }}
          spacing={2}
        >
          {data.map(({ name, [keyField]: keyValue }) => (
            <Grid item key={keyValue}>
              <Chip
                label={name}
                component={Button}
                sx={{ textTransform: "none" }}
                onClick={() => navigate(`/${entityName}/${keyValue}`)}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs />
    </Grid>
  );
};
