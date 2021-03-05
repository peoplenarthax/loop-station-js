import { IAudioNode } from './audio-node.base';

export class FoldbackDistortion extends IAudioNode {
  public audioNode: AudioWorkletNode;

  constructor(audioContext: AudioContext) {
    super('foldback-distortion', audioContext);
    this.audioNode = new AudioWorkletNode(
      this.audioContext,
      'foldback-distortion',
    );

    this.input = this.audioNode;
    this.output = this.audioNode;
  }

  get props() {
    return {
      cutOff: {
        step: 0.05,
        min: 0.01,
        max: 2,
        defaultValue: 1,
        displayName: 'Cut-Off',
        changeFunction: (value: number) => {
          this.audioNode.parameters
            ?.get('cutOff')
            ?.setValueAtTime(value, this.audioContext.currentTime);
        },
      },
    };
  }
}
