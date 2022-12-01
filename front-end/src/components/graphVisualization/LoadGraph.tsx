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
      size: 20,
      color: theme.palette.primary.light,
    });
    data.data.forEach((movie: any) => {
      const node = JSON.stringify(movie);
      if (graph.nodes().includes(node)) return;
      graph.addNode(node, {
        x: Math.random(),
        y: Math.random(),
        label: movie.title || movie.original_title,
        size: 5,
        color: alpha(theme.palette.primary.main, Math.max(Math.random(), 0.5)),
      });
      graph.addEdgeWithKey(`Rel to Movie ${movie.id}`, entityName, node);
    });
    loadGraph(graph);
    assign();
  }, [loadGraph, data, isLoading]);

  return null;
};
