import { useLoadGraph } from "@react-sigma/core";
import { MultiDirectedGraph } from "graphology";
import { useEffect } from "react";
import { GraphVisualProps } from "./GraphVisual";
import { useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import { alpha, useTheme } from "@mui/material";
import { entityTypeToKeyValue, nodeTypeToEntityType } from "./DisplayGraph";

export const LoadGraph = ({
  entityName,
  nodeLabel,
  data,
  isLoading,
}: GraphVisualProps) => {
  const theme = useTheme();
  const loadGraph = useLoadGraph();
  const { assign } = useLayoutForceAtlas2();

  const colors: any = {
    Genre: theme.palette.warning.main,
    Keyword: theme.palette.success.main,
    Cast: theme.palette.error.main,
    Crew: theme.palette.error.main,
    default: () =>
      alpha(theme.palette.primary.main, Math.max(Math.random(), 0.5)),
  };

  const neighboursList = data
    ? Array.isArray(data.data)
      ? data.data
      : Object.values(data).flat()
    : [];

  useEffect(() => {
    if (!data || isLoading) return;
    console.log({ data });
    const graph = new MultiDirectedGraph();
    graph.addNode(entityName, {
      x: Math.random(),
      y: Math.random(),
      label: nodeLabel,
      size: 20,
      color: theme.palette.primary.light,
    });
    neighboursList.forEach((datum: any) => {
      const node = JSON.stringify(datum);
      if (graph.nodes().includes(node)) return;
      graph.addNode(node, {
        x: Math.random(),
        y: Math.random(),
        label: datum.name || datum.title || datum.original_title,
        size: 5,
        color: colors[datum?.nodeType] || colors["default"](),
      });
      const id = entityTypeToKeyValue(
        nodeTypeToEntityType[datum?.nodeType] || "Movies",
        datum
      );
      graph.addEdgeWithKey(
        `Rel to ${datum?.nodeType || "Movies"} ${id}`,
        entityName,
        node
      );
    });
    loadGraph(graph);
    assign();
  }, [loadGraph, data, isLoading]);

  return null;
};
