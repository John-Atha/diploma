import { useLoadGraph } from "@react-sigma/core";
import { MultiDirectedGraph } from "graphology";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { getConnectedMovies } from "../../api/movies";
import { queriesKeys } from "../../api/queriesKeys";
import { GraphVisualProps } from "./GraphVisual";
import { useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import { alpha, useTheme } from "@mui/material";

export const LoadGraph = ({
  entityName,
  keyValue,
  nodeLabel,
}: GraphVisualProps) => {
  const theme = useTheme();
  const loadGraph = useLoadGraph();
  const { assign } = useLayoutForceAtlas2();

  const { data, isLoading, isError } = useQuery(
    [queriesKeys.getConnectedMovies(entityName), keyValue],
    () => getConnectedMovies(entityName, keyValue),
    {
      enabled: !!keyValue,
      cacheTime: 1000,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!data || isLoading) return;
    console.log({ data });
    const graph = new MultiDirectedGraph();
    graph.addNode(entityName, {
      x: Math.random(),
      y: Math.random(),
      label: nodeLabel,
      size: 30,
      color: theme.palette.primary.light,
    });
    data.data.forEach(({ id, title, original_title }: any) => {
      graph.addNode(`Movie ${id}`, {
        x: Math.random(),
        y: Math.random(),
        label: title || original_title,
        size: 5,
        color: alpha(theme.palette.primary.main, Math.max(Math.random(), 0.5)),
      });
      graph.addEdgeWithKey(`Rel to Movie ${id}`, entityName, `Movie ${id}`);
    });
    loadGraph(graph);
    assign();
  }, [loadGraph, data, isLoading]);

  return null;
};
