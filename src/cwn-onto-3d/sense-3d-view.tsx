import React, { useEffect } from 'react';
import { LemmaSense, LemmaSenses, SenseClouds, WsdToken } from './data-types';
import { build_graph, INode } from './build-graph';
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import "./sense-3d-view.css";

export interface Sense3dViewProps {
  tokens: WsdToken[];
  lemmaSenses: LemmaSenses;
  senseClouds: SenseClouds;    
}

export function Sense3dView(props: Sense3dViewProps){
  let graph3D: ForceGraph3DInstance;

  useEffect(()=>{
    console.log("sense 3d view");
    let graphData = build_graph(props.tokens, props.lemmaSenses, props.senseClouds);
    let graphElem = document.getElementById("graph-3d");

    if(graphElem !== null){
      graph3D = ForceGraph3D()(graphElem);
      let elemWidth = graphElem.parentElement!.clientWidth;

      graph3D.graphData(graphData)
        .width(elemWidth)
        .height(600)
        .nodeLabel("label")
        .nodeAutoColorBy("type")
        .nodeVal((x)=>{
          let node = x as INode;
          if(node.type == "Lemma") return 20;
          else return 3;
        })
        .linkWidth(3)
        .zoomToFit(500, 20);
    }
  }, [props.lemmaSenses, props.senseClouds])
  
  return (
    <div id="graph-3d"></div>
  )
}