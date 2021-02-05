import { IAudioNode } from './audio-node.base';

export class DynamicCompressor extends IAudioNode {
  public audioNode: DynamicsCompressorNode;

  constructor(audioContext: AudioContext) {
    super('compressor', audioContext);
    this.audioNode = audioContext.createDynamicsCompressor();

    this.input = this.audioNode;
    this.output = this.audioNode;

    this.initAudioNode();
  }

  initAudioNode = async () => {
    this.audioNode.threshold.value = -30;
    this.audioNode.knee.value = 10;
    this.audioNode.ratio.value = 12;
    this.audioNode.attack.value = 0;
    this.audioNode.release.value = 0.25;
  };

  get props() {
    return {
      knee: {
        min: 0,
        max: 40,
        defaultValue: this.audioNode.knee.value,
        step: 1,
        displayName: 'Knee',
        changeFunction: (value: number) => {
          this.audioNode.knee.value = value;
        },
      },
      threshold: {
        min: -100,
        max: 0,
        defaultValue: this.audioNode.threshold.value,
        step: 1,
        displayName: 'Threshold',
        changeFunction: (value: number) => {
          this.audioNode.threshold.value = value;
        },
      },
      ratio: {
        min: 1,
        max: 20,
        defaultValue: this.audioNode.ratio.value,
        step: 1,
        displayName: 'Ratio',
        changeFunction: (value: number) => {
          this.audioNode.ratio.value = value;
        },
      },
      attack: {
        min: 1,
        max: 20,
        defaultValue: this.audioNode.attack.value,
        step: 1,
        displayName: 'Attack',
        changeFunction: (value: number) => {
          this.audioNode.attack.value = value;
        },
      },
    };
  }
}
