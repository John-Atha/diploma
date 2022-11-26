import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  ZoomControl,
} from "@react-sigma/core";
import { GraphVisualProps } from "./GraphVisual";
import { LoadGraph } from "./LoadGraph";
import { alpha, Button, Grid, IconButton, Stack, Typography, useTheme } from "@mui/material";
import {
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";

export const DisplayGraph = ({
  entityName,
  keyValue,
  width,
  nodeLabel,
}: GraphVisualProps) => {
    const theme = useTheme();
  return (
    <SigmaContainer style={{ height: "80vh", width }}>
      <LoadGraph
        entityName={entityName}
        keyValue={keyValue}
        nodeLabel={nodeLabel}
      />
      <ControlsContainer
        position={"top-left"}
        style={{ width: 300, height: 100 }}
      >
        <Stack spacing={1}>
          <Grid
            container
            spacing={1}
            padding={1}
            // justifyContent="space-between"
          >
            <Grid item>
              <Typography variant="body1">Zoom level:</Typography>
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                <FullScreenControl>
                  <Fullscreen />
                  <FullscreenExit />
                </FullScreenControl>
                <ZoomControl>
                  <ZoomIn />
                  <ZoomOut />
                  <div style={{ fontSize: "small", paddingBottom: 6 }}>
                    100%
                  </div>
                </ZoomControl>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
        <SearchControl style={{ borderBottom: "1px solid grey", borderRadius: 7, margin: 5 }} />
      </ControlsContainer>
    </SigmaContainer>
  );
};
