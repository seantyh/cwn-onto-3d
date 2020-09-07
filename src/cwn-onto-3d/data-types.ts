
export type WsdToken = [Word, POS, SenseId, SenseDef];

export type LemmaSenses = {[lemma: string]: LemmaSense[]}
export interface LemmaSense {
  definition: string,
  id: string,
  pos: string
}

export type SenseClouds = {[senseId: string]: SenseCloud}
type RelationType = string;
type SenseId = string;
type Word = string;
type HeadWord = string;
type POS = string;
type SenseDef = string;
type SenseCloudRelation = [RelationType, SenseId, HeadWord, POS, SenseDef];
export interface SenseCloud {
  pwn: [RelationType, SenseId],  
  relations: SenseCloudRelation[],
  pwn_onto: {
    hypernyms?: SenseId[],
    hyponyms?: SenseId[],
    holonyms?: SenseId[],
    meronyms?: SenseId[]
  }
}

export interface SenseData {
  headWord: string,
  definition: string,  
  pos: string,
  example: string[]  
}