import React from "react";
import { Stack, Typography } from "@mui/material";
import "@react-sigma/core/lib/react-sigma.min.css";
import { DisplayGraph } from "./DisplayGraph";

export interface GraphVisualProps {
  width?: number;
  entityName: string;
  keyValue?: string;
  nodeLabel: string;
  centralNode?: any;
  centralNodeIsMovie?: boolean,
  data: any,
  isLoading: boolean,
  isError?: boolean,
}

export const GraphVisual = ({
  width,
  entityName,
  keyValue,
  nodeLabel,
  centralNode,
  centralNodeIsMovie,
  data,
  isLoading,
  isError,
}: GraphVisualProps) => {
  return (
    <Stack spacing={2} width={width}>
      <Typography paddingLeft={3} variant="h6">
        Graph visualization
      </Typography>
      <DisplayGraph
        entityName={entityName}
        keyValue={keyValue}
        width={width}
        nodeLabel={nodeLabel}
        centralNode={centralNode}
        centralNodeIsMovie={centralNodeIsMovie}
        data={data}
        isLoading={isLoading}
        isError={isError}
      />
    </Stack>
  );
};
