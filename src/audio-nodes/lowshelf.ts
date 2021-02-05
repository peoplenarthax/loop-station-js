import { IAudioNode } from './audio-node.base';

export class Lowshelf extends IAudioNode {
  public audioNode: BiquadFilterNode;

  constructor(audioContext: AudioContext) {
    super('lowshelf', audioContext);
    this.audioNode = audioContext.createBiquadFilter();

    this.input = this.audioNode;
    this.output = this.audioNode;

    this.initAudioNode();
  }

  initAudioNode = async () => {
    this.audioNode.type = 'lowshelf';
    this.audioNode.frequency.value = 400;
    this.audioNode.gain.value = 10;
  };

  get props() {
    return {
      gain: {
        step: 0.1,
        min: 0,
        max: 3,
        defaultValue: this.audioNode.gain.value,
        displayName: 'Gain',
        changeFunction: (value: number) => {
          this.audioNode.gain.value = value;
        },
      },
      freq: {
        step: 100,
        min: 20,
        max: 20000,
        defaultValue: this.audioNode.frequency.value,
        displayName: 'Frequency',
        changeFunction: (value: number) => {
          this.audioNode.frequency.value = value;
        },
      },
    };
  }
}
