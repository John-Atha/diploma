import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  ZoomControl,
} from "@react-sigma/core";
import { GraphVisualProps } from "./GraphVisual";
import { LoadGraph } from "./LoadGraph";
import { Grid, Slide, Stack, Typography, useTheme } from "@mui/material";
import {
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";
import { GraphEvents } from "./GraphEvents";
import { useEffect, useState } from "react";
import { SecondaryEntityVisualizationPaper } from "./SecondaryEntityVisualizationPaper";

export const nodeTypeToEntityType: any = {
  Cast: "People",
  Crew: "People",
  Genre: "Genres",
  Keyword: "Keywords",
  ProductionCompany: "ProductionCompanies",
  ProductionCountry: "ProductionCountries",
  Language: "Languages",
};

export const entityTypeToKeyValue = (entityType: string, node: any) => {
  if (!node) return null;
  switch (entityType) {
    case "People":
      return node.id;
    case "Genres":
      return node.name;
    case "Keywords":
      return node.name;
    case "ProductionCompanies":
      return node.name;
    case "ProductionCountries":
      return node.iso_3166_1;
    case "Languages":
      return node.iso_639_1;
    case "Movies":
      return node.id;
  }
};

export const DisplayGraph = ({
  entityName,
  keyValue,
  width,
  nodeLabel,
  centralNode,
  data,
  isLoading,
  isError,
}: GraphVisualProps) => {
  const theme = useTheme();

  const [selectedNode, setSelectedNode] = useState<any>(null);

  const clear = () => {
    setSelectedNode(null);
  };

  console.log({ selectedNode })

  return (
    <SigmaContainer
      style={{ height: "80vh", width }}
      settings={{ renderEdgeLabels: true, defaultEdgeType: "arrow" }}
    >
      <LoadGraph
        entityName={entityName}
        nodeLabel={nodeLabel}
        data={data}
        isLoading={isLoading}
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
          setSelectedNode({
            ...n,
            nodeType: nodeTypeToEntityType[n?.nodeType] || "Movies",
            keyValue: entityTypeToKeyValue(
              nodeTypeToEntityType[n?.nodeType] || "Movies",
              n
            ),
          });
        }}
        selectCentralNode={() => {
          setSelectedNode({ ...centralNode, nodeType: entityName, keyValue });
        }}
        clear={clear}
      />
      <Slide direction="left" in={!!selectedNode} mountOnEnter unmountOnExit>
        <div>
          <SecondaryEntityVisualizationPaper
            entityName={selectedNode?.nodeType || "Movies"}
            keyValue={selectedNode?.keyValue}
            clear={clear}
          />
        </div>
      </Slide>
    </SigmaContainer>
  );
};
