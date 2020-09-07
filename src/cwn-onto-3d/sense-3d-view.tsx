import React, { useEffect } from 'react';
import { LemmaSense, LemmaSenses, SenseClouds, WsdToken } from './data-types';
import { build_graph, INode } from './build-graph';
import ForceGraph3D from '3d-force-graph';

export interface Sense3dViewProps {
  tokens: WsdToken[];
  lemmaSenses: LemmaSenses;
  senseClouds: SenseClouds;    
}

export function Sense3dView(props: Sense3dViewProps){
  useEffect(()=>{
    console.log("sense 3d view");
    let graphData = build_graph(props.tokens, props.lemmaSenses, props.senseClouds);
    let graphElem = document.getElementById("3d-graph");
    if(graphElem !== null){
      let graph3D = ForceGraph3D()(graphElem);
      let engine = graph3D.forceEngine();
      graph3D.graphData(graphData)
        .nodeLabel("label")
        .nodeAutoColorBy("type")
        .nodeVal((x)=>{
          let node = x as INode;
          if(node.type == "Lemma") return 20;
          else return 3;
        })
        .linkWidth(10)
        .enableNodeDrag(true);
    }
  }, [props.lemmaSenses, props.senseClouds])
  return (
    <div id="3d-graph"></div>
  )
}