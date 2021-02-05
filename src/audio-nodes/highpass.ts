import { IAudioNode } from './audio-node.base';

export class Highpass extends IAudioNode {
  public audioNode: BiquadFilterNode;

  constructor(audioContext: AudioContext) {
    super('highpass', audioContext);
    this.audioNode = audioContext.createBiquadFilter();

    this.input = this.audioNode;
    this.output = this.audioNode;

    this.initAudioNode();
  }

  initAudioNode = async () => {
    this.audioNode.type = 'highpass';
    this.audioNode.frequency.value = 400;
    this.audioNode.Q.value = 10;
  };

  get props() {
    return {
      q: {
        step: 1,
        min: -20,
        max: 100,
        defaultValue: 10,
        displayName: 'Q',
        changeFunction: (value: number) => {
          this.audioNode.Q.value = value;
        },
      },
      freq: {
        step: 100,
        min: 20,
        max: 20000,
        defaultValue: 400,
        displayName: 'Frequency',
        changeFunction: (value: number) => {
          this.audioNode.frequency.value = value;
        },
      },
    };
  }
}
