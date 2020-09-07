import { LemmaSense, SenseClouds, LemmaSenses, WsdToken } from "./data-types";

export interface OntoGraph {
  nodes: INode[];
  links: IEdge[];
}

export interface INode {
  id: string;
  type: "Lemma" | "CwnSense" | "PwnSynset" |
        "HyperHypo" | "HoloMero";        
  label: string;
  fx?: number;
  fy?: number;
  fz?: number;
}

export interface IEdge {
  source: string;
  target: string;
  label: string;
}

export function build_graph(tokens: WsdToken[], lemmaSenses: LemmaSenses, senseClouds: SenseClouds) {
  let V = {} as { [nid: string]: INode };
  let E = {} as { [eid: string]: IEdge };;
  
  const PWN_LEVEL_0 = -100;
  const PWN_LEVEL_1 = -200;
  let lemmaMap: {[lemma: string]: string[]} = {};
  tokens.map((token, idx)=>{
    let lemma = token[0];
    let nid = `${lemma}-${idx}`;
    
    if (lemma in lemmaMap){
      lemmaMap[lemma].push(nid);
    } else {
      lemmaMap[lemma] = [nid];
    }
    
    V[nid] = {
      id: nid, type: "Lemma", label: lemma,
      fx: idx * 100, fy: 0, fz: 0
    } as INode;
  });

  Object.entries(lemmaSenses)
    .map((val, idx) => {
      let [lemma, senses] = val;
      
      senses.map((sense: LemmaSense) => {
        V[sense.id] = {
          id: sense.id,
          type: "CwnSense",
          label: `(${sense.pos}) ${sense.definition}`,
          fx: lemmaMap[lemma].reduce((sum, lemmaNodeId)=>{
            sum += V[lemmaNodeId].fx !== undefined ? V[lemmaNodeId].fx!: 0;
            return sum;
          }, 0) / lemmaMap[lemma].length
        }

        lemmaMap[lemma].map((lemmaNodeId)=>{
          let eid = `${lemmaNodeId}-${sense.id}`;
          E[eid] = {
            "source": lemmaNodeId,
            "target": sense.id,
            "label": "hasSense"
          };
        });
      })

    });

  Object.entries(senseClouds)
    .map((val, idx) => {
      let [srcSenseId, senseCloud] = val;

      senseCloud.relations.map((sense) => {
        let [relType, senseId, headWord, pos, senseDef] = sense;
        if (!(senseId in V)) {
          V[senseId] = {
            id: senseId, type: "CwnSense", label: `[${headWord}] (${pos}) ${senseDef}`
          }
        }

        let eid = `${srcSenseId}-${senseId}`;
        E[eid] = {
          source: srcSenseId, target: senseId, label: "CwnRelation"
        }
      });

      // build PWN synset link
      let [_, pwnId] = senseCloud.pwn;
      if (!(pwnId in V)) {
        V[pwnId] = {
          id: pwnId, type: "PwnSynset", label: pwnId,
          fy: PWN_LEVEL_0
        }
      }

      let eid = `${srcSenseId}-${pwnId}`;
      E[eid] = {
        source: srcSenseId, target: pwnId, label: "PwnMapping"
      }

      // build PWN synset relations
      // link hypernyms
      let pwn_onto = senseCloud.pwn_onto;

      let link_chains = (chain: string[] | undefined, src: string, edgeLabel: string) => {
        if (chain === undefined) {
          return;
        }

        chain.reduce((prevPwnId, curPwnId) => {
          if (!(curPwnId in V)) {
            V[curPwnId] = {
              id: curPwnId, type: "HyperHypo", label: curPwnId,
              fy: PWN_LEVEL_1
            }
          }

          let eid = `${prevPwnId}-${curPwnId}`;
          E[eid] = {
            source: prevPwnId, target: curPwnId, label: edgeLabel
          }
          return curPwnId;
        }, src);
      }

      let link_to_base = (chain: string[] | undefined, src: string, edgeLable: string) => {
        if (chain === undefined) {
          return;
        }

        chain.map((curPwnId) => {
          if (!(curPwnId in V)) {
            V[curPwnId] = {
              id: curPwnId, type: "HoloMero", label: curPwnId,
              fy: PWN_LEVEL_1
            }
          }

          let eid = `${src}-${curPwnId}`;
          E[eid] = {
            source: src, target: curPwnId, label: edgeLable
          }
        });
      }

      link_chains(pwn_onto.hypernyms, pwnId, "hypernymy");
      link_chains(pwn_onto.hyponyms, pwnId, "hyponymy");
      link_to_base(pwn_onto.holonyms, pwnId, "holonymy");
      link_to_base(pwn_onto.meronyms, pwnId, "meronymy");

    });

  let G = { nodes: Object.values(V), links: Object.values(E) } as OntoGraph;
  console.log(G);
  return G
}