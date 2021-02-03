import { Highshelf } from '../audio-nodes/highshelf';
import type { IAudioNode } from '../audio-nodes/audio-node.base';
import { Highpass } from '../audio-nodes/highpass';
import { Lowpass } from '../audio-nodes/lowpass';
import { Reverb } from '../audio-nodes/reverb';
import { PingPong } from '../audio-nodes/pingpong';
import { Gain } from '../audio-nodes/gain';
import { DynamicCompressor } from '../audio-nodes/compressor';
import { Lowshelf } from '../audio-nodes/lowshelf';
import { DubDelay } from '../audio-nodes/ring-modulator';

type ChannelConstructor = {
  context: AudioContext;
  source: MediaElementAudioSourceNode;
};

export enum AudioNodeName {
  reverb = 'reverb',
  lowpass = 'lowpass',
  highpass = 'highpass',
  highshelf = 'highshelf',
  pingpong = 'pingpong',
  gain = 'gain',
  compressor = 'compressor',
  lowshelf = 'lowshelf',
  ringmodulator = 'ringmodulator',
}

const FILTER_MAP: {
  [key in AudioNodeName]: (context: AudioContext) => IAudioNode;
} = {
  reverb: (context: AudioContext) => new Reverb(context),
  lowpass: (context: AudioContext) => new Lowpass(context),
  highpass: (context: AudioContext) => new Highpass(context),
  highshelf: (context: AudioContext) => new Highshelf(context),
  pingpong: (context: AudioContext) => new PingPong(context),
  gain: (context: AudioContext) => new Gain(context),
  compressor: (context: AudioContext) => new DynamicCompressor(context),
  lowshelf: (context: AudioContext) => new Lowshelf(context),
  ringmodulator: (context: AudioContext) => new DubDelay(context),
};

export type ChannelNode = any;
export class Channel {
  public source: MediaElementAudioSourceNode;
  public audioContext: AudioContext;
  public audioNodes: any = {};
  private filters: string[] = [];

  constructor({ context, source }: ChannelConstructor) {
    this.source = source;
    this.audioContext = context;

    this.applyFilters();
  }

  setSource(audio: HTMLMediaElement) {
    this.source = this.audioContext.createMediaElementSource(audio);

    this.applyFilters();
  }

  addAudioNode(audioNodeName: AudioNodeName): string {
    const audioNode = FILTER_MAP[audioNodeName](this.audioContext);
    this.audioNodes[audioNode.name] = audioNode;
    if (this.filters.length > 0) {
      this.audioNodes[this.filters[this.filters.length - 1]].output.disconnect(
        this.audioContext.destination,
      );
    } else {
      this.source.disconnect(this.audioContext.destination);
    }
    this.filters.push(audioNode.name);

    this.applyFilters();
    return audioNode.name;
  }

  // TODO: Refactor remove
  removeAudioNode(nodeName: string) {
    const filters = Object.keys(this.audioNodes);
    const index = filters.findIndex((key) => key === nodeName);

    if (index === 0) {
      if (filters.length === 1) {
        this.source.disconnect(this.audioNodes[nodeName].input);

        delete this.audioNodes[nodeName];

        this.source.connect(this.audioContext.destination);
        return;
      }
      this.source.disconnect(this.audioNodes[nodeName].input);

      delete this.audioNodes[nodeName];

      this.source.connect(this.audioNodes[filters[1]].input);
      return;
    }

    if (index !== filters.length - 1) {
      this.audioNodes[filters[index - 1]].output.disconnect(
        this.audioNodes[nodeName].input,
      );

      delete this.audioNodes[nodeName];

      this.audioNodes[filters[index - 1]].output.connect(
        this.audioNodes[filters[index + 1]].input,
      );
      return;
    }

    this.audioNodes[filters[index - 1]].output.disconnect(
      this.audioNodes[nodeName].input,
    );

    delete this.audioNodes[nodeName];

    this.audioNodes[filters[index - 1]].output.connect(
      this.audioContext.destination,
    );
  }

  getAudioNodeComponent(name: string) {
    return {
      component: this.audioNodes[name].component,
      props: this.audioNodes[name].props,
    };
  }

  applyFilters() {
    if (this.filters.length === 0) {
      this.source.connect(this.audioContext.destination);
      return;
    }

    for (let id = 0; id < this.filters.length; id++) {
      const nodeToConnectId = id - 1;

      if (nodeToConnectId < 0) {
        this.source.connect(this.audioNodes[this.filters[id]].input);
        continue;
      }

      this.audioNodes[this.filters[nodeToConnectId]].output.connect(
        this.audioNodes[this.filters[id]].input,
      );
    }

    this.audioNodes[this.filters[this.filters.length - 1]].output.connect(
      this.audioContext.destination,
    );
  }
}
