import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  ZoomControl,
} from "@react-sigma/core";
import { GraphVisualProps } from "./GraphVisual";
import { LoadGraph } from "./LoadGraph";
import {
  Grid,
  Slide,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";
import { GraphEvents } from "./GraphEvents";
import { useState } from "react";
import { MovieVisualizationPaper } from "./MovieVisualizationPaper";
import { SecondaryEntityVisualizationPaper } from "./SecondaryEntityVisualizationPaper";

export const DisplayGraph = ({
  entityName,
  keyValue,
  width,
  nodeLabel,
  centralNode,
}: GraphVisualProps) => {
  const theme = useTheme();

  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isCentralNodeSelected, setIsCentralNodeSelected] = useState(false);

  return (
    <SigmaContainer
      style={{ height: "80vh", width }}
      settings={{ renderEdgeLabels: true, defaultEdgeType: "arrow" }}
    >
      <LoadGraph
        entityName={entityName}
        keyValue={keyValue}
        nodeLabel={nodeLabel}
        centralNode={centralNode}
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
        <SearchControl
          style={{ borderBottom: "1px solid grey", borderRadius: 7, margin: 5 }}
        />
      </ControlsContainer>
      <GraphEvents
        setFocusedNode={(n) => {
          setSelectedNode(n);
          setIsCentralNodeSelected(false);
        }}
        selectCentralNode={() => {
          setIsCentralNodeSelected(true);
          setSelectedNode(null);
        }}
      />
      <Slide direction="left" in={!!selectedNode} mountOnEnter unmountOnExit>
        <div>
          <MovieVisualizationPaper
            movie_id={selectedNode?.id}
            clear={() => setSelectedNode(null)}
          />
        </div>
      </Slide>
      <Slide
        direction="left"
        in={!!isCentralNodeSelected}
        mountOnEnter
        unmountOnExit
      >
        <div>
          <SecondaryEntityVisualizationPaper
            clear={() => setIsCentralNodeSelected(false)}
            entityName={entityName}
            keyValue={keyValue}
          />
        </div>
      </Slide>
    </SigmaContainer>
  );
};
