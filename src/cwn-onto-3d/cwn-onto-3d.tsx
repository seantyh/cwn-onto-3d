import React, { useRef } from 'react';
import "./cwn-onto-3d.css"
import { useOntoState } from './onto-state';
import { WsdView } from './wsd-view';
import { Sense3dView } from './sense-3d-view';

export function CwnOnto3D() {
  let { ontoState, controller } = useOntoState();
  let inputElem = useRef(null);

  let onInputKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === "Enter") {
      console.log("enter");
      controller.updateSentence("<default>");
    }
  }

  // controller.selectSense("");
  return (
    <div>
      <input
        ref={inputElem}
        id="inputText" type="text"
        onKeyDown={onInputKeyDown}
        placeholder="輸入句子"></input>
      <div className="cwn-onto-3d">
        <WsdView tokens={ontoState.tokens}/>
        <Sense3dView 
          tokens={ontoState.tokens}
          lemmaSenses={ontoState.lemmaSenses}
          senseClouds={ontoState.senseClouds}/>
      </div>
    </div>
  )
}