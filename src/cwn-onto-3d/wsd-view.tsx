import React from 'react';
import { WsdToken } from './data-types';
import "./wsd-token.css"

export interface WsdViewProps {
  tokens: WsdToken[]
}

export function WsdView(props: WsdViewProps) {
  console.log("WsdView")
  console.log(props);
  let words = props.tokens.map((x: WsdToken, idx: number) => {
    return (
      <div key={`token-${x[0]}-${idx}`} className="token-wrapper">
        <div className="pos">
          {x[1].endsWith("CATEGORY")? "": x[1]}
        </div>
        <div className="word">{x[0]}</div>        
        <div className="badge badge-info sense-def">{x[3]}</div>
      </div>)
  });

  return (
    <div className="d-flex flex-wrap">
      {words}
    </div>
  )
}