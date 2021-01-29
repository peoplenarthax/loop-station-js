import { impulseResponse } from '../sound/impulse';

type ChannelConstructor = {
  context: AudioContext;
  source: MediaElementAudioSourceNode;
};

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const byteArray = binaryString
    .split('')
    .map((char: string) => char.charCodeAt(0));

  const bytes = new Uint8Array(byteArray);

  return bytes.buffer;
};

export enum AudioNodeName {
  reverb = 'reverb',
}
export type ChannelNode = any;

export class Channel {
  public source: MediaElementAudioSourceNode;
  public audioContext: AudioContext;
  private reverb: ConvolverNode | undefined;
  public reverbOpts: { impulse: string; normalize: boolean } = {
    impulse: impulseResponse,
    normalize: true,
  };
  private filters: AudioNodeName[] = [];

  constructor({ context, source }: ChannelConstructor) {
    this.source = source;
    this.audioContext = context;

    this.applyFilters();
    this.createReverb();
  }

  async createReverb() {
    this.reverb = this.audioContext.createConvolver();
    this.reverb.buffer = await this.audioContext.decodeAudioData(
      base64ToArrayBuffer(this.reverbOpts.impulse),
    );
    this.reverb.normalize = this.reverbOpts.normalize;
    // this.source.connect(reverb);
    // reverb.connect(this.audioContext.destination);
  }

  async setReverb(opts: { impulse?: string; disableNormalization?: boolean }) {
    if (this.reverb) {
      this.reverb.buffer = await this.audioContext.decodeAudioData(
        base64ToArrayBuffer(this.reverbOpts.impulse),
      );
      this.reverb.normalize = !!this.reverbOpts.normalize;
    }
  }

  setSource(audio: HTMLMediaElement) {
    this.source = this.audioContext.createMediaElementSource(audio);

    this.applyFilters(this.filters);
  }

  applyFilters(filters: AudioNodeName[] = []) {
    console.log('Creating filters');

    if (filters.length === 0) {
      console.log('length 0');

      this.source.connect(this.audioContext.destination);
      return;
    }

    if (this.filters.length === 0) {
      console.log('Disconnect');
      this.source.disconnect(this.audioContext.destination);
    }

    for (let id = 0; id < filters.length; id++) {
      console.log('Creating filters for ', filters[id]);

      const nodeToConnectId = id - 1;

      if (nodeToConnectId) {
        this.source.connect(this[filters[id]] as AudioNode);
        continue;
      }

      this[filters[id - 1]]?.connect(this[filters[id]] as AudioNode);
    }

    this[filters[filters.length - 1]]?.connect(this.audioContext.destination);

    this.filters = filters;
  }
}
