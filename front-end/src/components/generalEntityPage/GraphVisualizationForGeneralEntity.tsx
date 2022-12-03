import React from "react";
import { useQuery } from "react-query";
import { getConnectedMoviesForVisualization } from "../../api/movies";
import { queriesKeys } from "../../api/queriesKeys";
import { GraphVisual } from "../graphVisualization/GraphVisual";

export interface GraphVisualForGeneralEntityProps {
  width?: number;
  entityName: string;
  keyValue?: string;
  nodeLabel: string;
  centralNode?: any;
  centralNodeIsMovie?: boolean;
}

export const GraphVisualizationForGeneralEntity = ({
  width,
  entityName,
  keyValue,
  nodeLabel,
  centralNode,
}: GraphVisualForGeneralEntityProps) => {
  const {
    data: visData,
    isLoading: visLoading,
    isError: visError,
  } = useQuery(
    [queriesKeys.getConnectedMoviesForVisualization(entityName), keyValue],
    () => getConnectedMoviesForVisualization(entityName, keyValue as string),
    {
      enabled: !!keyValue,
      cacheTime: 1000,
      refetchOnWindowFocus: false,
    }
  );
  return (
    <GraphVisual
      width={width}
      entityName={entityName}
      keyValue={keyValue as string}
      nodeLabel={nodeLabel}
      centralNode={centralNode}
      data={visData}
      isLoading={visLoading}
      isError={visError}
    />
  );
};
