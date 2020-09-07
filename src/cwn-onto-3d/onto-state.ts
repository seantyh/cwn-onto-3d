import React, { useState, useReducer } from 'react';
import { WsdToken, SenseClouds, SenseData, LemmaSenses } from "./data-types";
import * as api from './data-api';

interface CwnOntoState {
  sentence: string;
  tokens: WsdToken[];
  senseClouds: SenseClouds;
  lemmaSenses: LemmaSenses;
  selSenseData: SenseData;
}

type CwnOntoAction =
  COA_NewSentence | COA_NewTokens | 
  COA_NewSenseClouds | COA_NewLemmaSenses |
  COA_SelectedSense;

interface COA_NewSentence {
  type: "NEW_SENTENCE",
  payload: string
}

interface COA_NewTokens {
  type: "NEW_TAGGED",
  payload: WsdToken[]
}

interface COA_NewLemmaSenses {
  type: "NEW_LEMMA_SENSES",
  payload: LemmaSenses
}

interface COA_NewSenseClouds {
  type: "NEW_SENSE_CLOUDS",
  payload: SenseClouds
}

interface COA_SelectedSense {
  type: "SELECT_SENSE",
  payload: SenseData
}

function initState(){
  return {
    sentence: "",
    tokens: [],
    senseClouds: {} as SenseClouds,
    lemmaSenses: {} as LemmaSenses,
    selSenseData: {} as SenseData
  } as CwnOntoState
}

function reducer(state: CwnOntoState, action: CwnOntoAction) {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case 'NEW_SENTENCE':
      newState.sentence = action.payload;
      break;
    case 'NEW_TAGGED':
      newState.tokens = action.payload;
      break;    
    case 'NEW_LEMMA_SENSES':
      newState.lemmaSenses = action.payload;
      break;
    case 'NEW_SENSE_CLOUDS':
      newState.senseClouds = action.payload;
      break;
    case 'SELECT_SENSE':
      newState.selSenseData = action.payload;
      break;
    default:
    // pass
  }
  return newState;
}

export interface ontoController {
  updateSentence: (sentence: string) => void,
  selectSense: (senseId: string) => void
}

export function useOntoState() {
  let [ontoState, dispatch] = useReducer(reducer, {} as CwnOntoState, initState);

  function updateSentence(sentence: string) {    
    if(sentence !== ontoState.sentence){
      dispatch({"type": "NEW_SENTENCE", "payload": sentence});
    } else {
      return;
    }

    api.get_tag(sentence)
      .then((tokens) => {
        console.log("tagged");
        console.log(tokens);
        dispatch({"type": "NEW_TAGGED", "payload": tokens});
        api.get_lemma_senses(tokens)
          .then((lemma_senses) => {
            console.log("lemma senses");
            console.log(lemma_senses);
            dispatch({"type": "NEW_LEMMA_SENSES", "payload": lemma_senses});
          });  
        let wsd = api.get_wsd(tokens);
        return wsd;
      }).then((tokens)=>{
        console.log("wsd");
        console.log(tokens);
        dispatch({"type": "NEW_TAGGED", "payload": tokens});

        let sense_clouds = api.get_sense_clouds(tokens);        
        return sense_clouds
      }).then((clouds: SenseClouds) => {
        console.log("sense clouds");
        console.log(clouds);

        dispatch({"type": "NEW_SENSE_CLOUDS", "payload": clouds});
      });
  }

  function selectSense(senseId: string) {
    api.get_sense_data(senseId)
      .then((data: SenseData)=>{
        console.log("sense data");
        console.log(data);
        dispatch({"type": "SELECT_SENSE", "payload": data});
      })
  }

  let controller = { updateSentence, selectSense } as ontoController;
  return {ontoState, controller};
}