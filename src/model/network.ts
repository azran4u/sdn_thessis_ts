import * as graphlib from 'graphlib';
import { Subscriber } from './subscriber';
import { Producer } from './producer';
import { VideoRequest } from './videoRequest';

export interface Network {
    graph: graphlib.Graph;
    subscribers: Subscriber[];
    producers: Producer[];
    requests: VideoRequest[];
}
