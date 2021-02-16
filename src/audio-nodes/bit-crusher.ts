import { IAudioNode } from './audio-node.base';

export class BitCrusher extends IAudioNode {
  public audioNode: AudioWorkletNode;

  constructor(audioContext: AudioContext) {
    super('bit-crusher', audioContext);
    this.audioNode = new AudioWorkletNode(this.audioContext, 'bit-crusher');

    this.input = this.audioNode;
    this.output = this.audioNode;
  }

  get props() {
    return {
      bitDepth: {
        step: 1,
        min: 1,
        max: 16,
        defaultValue: 16,
        displayName: 'Bit depth',
        changeFunction: (value: number) => {
          this.audioNode.parameters
            .get('bitDepth')
            ?.setValueAtTime(value, this.audioContext.currentTime);
        },
      },
      freq: {
        step: 0.05,
        min: 0.1,
        max: 1,
        defaultValue: 1,
        displayName: 'Downsampling',
        changeFunction: (value: number) => {
          this.audioNode.parameters
            .get('frequencyDownsampling')
            ?.setValueAtTime(value, this.audioContext.currentTime);
        },
      },
    };
  }
}
