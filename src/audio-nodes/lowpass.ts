import { IAudioNode } from './audio-node.base';

export class Lowpass extends IAudioNode {
  public audioNode: BiquadFilterNode;

  constructor(audioContext: AudioContext) {
    super('lowpass', audioContext);
    this.audioNode = audioContext.createBiquadFilter();

    this.input = this.audioNode;
    this.output = this.audioNode;

    this.initAudioNode();
  }

  initAudioNode = async () => {
    this.audioNode.type = 'lowpass';
    this.audioNode.frequency.value = 400;
    this.audioNode.Q.value = 10;
  };

  get props() {
    return {
      q: {
        step: 1,
        min: -20,
        max: 100,
        defaultValue: this.audioNode.Q.value,
        displayName: 'Q',
        changeFunction: (value: number) => {
          this.audioNode.Q.value = value;
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
