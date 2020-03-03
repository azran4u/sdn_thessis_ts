import { LAYER } from "./layer";

export type Content = {producerId: string, layer: LAYER};
export type ContentTree = Map<Content, string[]>;