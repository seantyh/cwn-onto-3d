import { WsdToken, LemmaSenses, SenseClouds, SenseData } from './data-types';

export function get_tag(sentence: string): Promise<WsdToken[]> {
  return fetch("data/tag.json")
    .then((result) => result.json())
    .then((result) => {
      let data = result.data;
      let tokens: WsdToken[] = data[0];
      return tokens
    });
}

export function get_wsd(taggedList: WsdToken[]): Promise<WsdToken[]> {
  return fetch("data/wsd.json")
    .then((result) => result.json())
    .then((result) => {
      let data = result.data;
      let tokens: WsdToken[] = data[0];
      return tokens
    });
}

export function get_lemma_senses(taggedList: WsdToken[]): Promise<LemmaSenses> {
  return fetch("data/lemmas.json")
    .then((result) => result.json())
    .then((result) => {
      let data = result.data;
      return data as LemmaSenses;
    });
}

export function get_sense_clouds(taggedList: WsdToken[]): Promise<SenseClouds> {
  return fetch("data/sense_clouds.json")
    .then((result) => result.json())
    .then((result) => {
      let data = result.data;
      return data as SenseClouds;
    });
}

export function get_sense_data(senseId: string): Promise<SenseData> {
  return fetch("data/sense_data.json")
    .then((result) => result.json())
    .then((result) => {
      let data = result.data;
      return data as SenseData;
    });
}