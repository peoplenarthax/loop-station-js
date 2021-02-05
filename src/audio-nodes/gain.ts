import { IAudioNode } from './audio-node.base';
export class Gain extends IAudioNode {
  public audioNode: GainNode;

  constructor(audioContext: AudioContext) {
    super('gain', audioContext);
    this.audioNode = audioContext.createGain();

    this.input = this.audioNode;
    this.output = this.audioNode;

    this.initAudioNode();
  }

  initAudioNode = async () => {
    this.audioNode.gain.value = 0.4;
  };

  get props() {
    return {
      gain: {
        displayName: 'Gain',
        min: 0,
        max: 3,
        defaultValue: this.audioNode.gain.value,
        step: 0.1,
        changeFunction: (value: number) => (this.audioNode.gain.value = value),
      },
    };
  }
}
