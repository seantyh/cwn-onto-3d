import { WsdToken, LemmaSenses, SenseClouds, SenseData } from './data-types';

const API_URL = "http://140.112.147.132:5555/";

export function get_tag(sentence: string, dummy=false): Promise<WsdToken[]> {
  let resp: Promise<Response>;
  if (dummy){
    resp = fetch("data/tag.json")
  } else {
    resp = fetch(API_URL+"tag", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        sentences: [sentence]
      })
    })
  }

  return resp
    .then((result) => result.json())
    .then((result) => {
      let data = result.data;
      let tokens: WsdToken[] = data[0];
      return tokens
    });
}

export function get_wsd(taggedList: WsdToken[], dummy=false): Promise<WsdToken[]> {
  let resp: Promise<Response>;
  if (dummy){
    resp = fetch("data/wsd.json")
  } else {
    resp = fetch(API_URL+"wsd", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        tagged: [taggedList]
      })
    })
  }

  return resp
    .then((result) => result.json())
    .then((result) => {
      let data = result.data;
      let tokens: WsdToken[] = data[0];
      return tokens
    });
}

export function get_lemma_senses(taggedList: WsdToken[], dummy=false): Promise<LemmaSenses> {
  let resp: Promise<Response>;
  if (dummy){
    resp = fetch("data/lemmas.json")
  } else {
    let lemmasStr = taggedList.map((x)=>x[0]).join(",");
    let url = new URL(API_URL+"lemma");
    url.search = new URLSearchParams({lemmas: lemmasStr}).toString();
    resp = fetch(url.toString());
  }

  return resp
    .then((result) => result.json())
    .then((result) => {
      let data = result.data;
      return data as LemmaSenses;
    });
}

export function get_sense_clouds(taggedList: WsdToken[], dummy=false): Promise<SenseClouds> {
  let resp: Promise<Response>;
  if (dummy){
    resp = fetch("data/sense_clouds.json")
  } else {
    let senseIds = taggedList.map((x)=>x[2]).join(",");
    let url = new URL(API_URL+"sense_cloud");
    url.search = new URLSearchParams({sids: senseIds}).toString();
    resp = fetch(url.toString());
  }

  return resp
    .then((result) => result.json())
    .then((result) => {
      let data = result.data;
      return data as SenseClouds;
    });
}

export function get_sense_data(senseId: string, dummy=false): Promise<SenseData> {
  let resp: Promise<Response>;
  if (dummy){
    resp = fetch("data/sense_clouds.json")
  } else {
    let url = new URL(API_URL+"sense_data/" + senseId);
    resp = fetch(url.toString());
  }

  return resp
    .then((result) => result.json())
    .then((result) => {
      let data = result.data;
      return data as SenseData;
    });
}