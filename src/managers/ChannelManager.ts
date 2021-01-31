import { Highshelf } from '../audio-nodes/highshelf';
import type { IAudioNode } from '../audio-nodes/audio-node.base';
import { Highpass } from '../audio-nodes/highpass';
import { Lowpass } from '../audio-nodes/lowpass';
import { Reverb } from '../audio-nodes/reverb';
import { PingPong } from '../audio-nodes/pingpong';

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
}

const FILTER_MAP: {
  [key in AudioNodeName]: (context: AudioContext) => IAudioNode;
} = {
  reverb: (context: AudioContext) => new Reverb(context),
  lowpass: (context: AudioContext) => new Lowpass(context),
  highpass: (context: AudioContext) => new Highpass(context),
  highshelf: (context: AudioContext) => new Highshelf(context),
  pingpong: (context: AudioContext) => new PingPong(context),
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
    }
    this.filters.push(audioNode.name);

    this.applyFilters();
    return audioNode.name;
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

    if (this.filters.length === 0) {
      this.source.disconnect(this.audioContext.destination);
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
