import React, { useRef, useEffect, useState } from 'react';
import "./cwn-onto-3d.css"
import { useOntoState } from './onto-state';
import { WsdView } from './wsd-view';
import { Sense3dView } from './sense-3d-view';

export function CwnOnto3D() {
  let { ontoState, controller } = useOntoState();
  let inputElem = useRef<HTMLInputElement>(null);
  let [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    controller.updateSentence("<default>", ()=>setIsLoading(false), true);
  }, []);

  let onInputKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === "Enter") {
      console.log("enter");
      if (inputElem.current){
        setIsLoading(true);
        let txtInput = inputElem.current.value;              
        controller.updateSentence(txtInput, ()=>setIsLoading(false));
      }
    }
  }

  let spinner = isLoading? (<div className="loader">Loading</div>): null;
  return (
    <div className="container">
      <input
        ref={inputElem}
        id="inputText" type="text"
        onKeyDown={onInputKeyDown}
        placeholder="輸入句子"></input>
      <div className="cwn-onto-3d">
        {spinner} 
        <WsdView tokens={ontoState.tokens}/>               
        <Sense3dView           
          tokens={ontoState.tokens}
          lemmaSenses={ontoState.lemmaSenses}
          senseClouds={ontoState.senseClouds}/>
      </div>
    </div>
  )
}