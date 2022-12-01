// https://sim51.github.io/react-sigma/docs/example/drag_n_drop

import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { useEffect, useState } from "react";

export interface GraphEventsProps {
  setFocusedNode: (e: any) => void;
  selectCentralNode: () => void;
  clear: () => void;
}

export const GraphEvents = ({
  setFocusedNode,
  selectCentralNode,
  clear,
}: GraphEventsProps) => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  useEffect(() => {
    // Register the events
    registerEvents({
      // main events
      clickNode: (e) => {
        console.log(e);
        try {
          setFocusedNode(JSON.parse(e.node));
        } catch (err) {
            selectCentralNode();
        }
      },
      clickStage: () => {
        clear();
      },
      clickEdge: (e) => {
        console.log(e.edge);
      },
      // for drag n' drop
      downNode: (e) => {
        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
      },
      mouseup: (e) => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
        }
      },
      mousedown: (e) => {
        // Disable the autoscale at the first down interaction
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
      mousemove: (e) => {
        if (draggedNode) {
          // Get new position of node
          const pos = sigma.viewportToGraph(e);
          sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
          sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

          // Prevent sigma to move camera:
          e.preventSigmaDefault();
          e.original.preventDefault();
          e.original.stopPropagation();
        }
      },
      touchup: (e) => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
        }
      },
      touchdown: (e) => {
        // Disable the autoscale at the first down interaction
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
      touchmove: (e) => {
        if (draggedNode) {
          // Get new position of node
          const pos = sigma.viewportToGraph(e as any);
          sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
          sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

          // Prevent sigma to move camera:
          (e as any).preventSigmaDefault();
          e.original.preventDefault();
          e.original.stopPropagation();
        }
      },
    });
  }, [registerEvents, sigma, draggedNode]);

  return null;
};
