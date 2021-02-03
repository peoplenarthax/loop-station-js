import { CompressorController } from '../components/node-controllers/CompressorController';
import { IAudioNode } from './audio-node.base';

export class DynamicCompressor extends IAudioNode {
  public audioNode: DynamicsCompressorNode;
  public component = CompressorController;

  constructor(audioContext: AudioContext) {
    super('compressor', audioContext);
    this.audioNode = audioContext.createDynamicsCompressor();

    this.input = this.audioNode;
    this.output = this.audioNode;

    this.initAudioNode();
  }

  initAudioNode = async () => {
    this.audioNode.threshold.value = -50;
    this.audioNode.knee.value = 40;
    this.audioNode.ratio.value = 12;
    this.audioNode.attack.value = 0;
    this.audioNode.release.value = 0.25;
  };

  get props() {
    return {
      onChangeKnee: (value: number) => {
        this.audioNode.knee.value = value;
      },
      onChangeThreshold: (value: number) => {
        this.audioNode.threshold.value = value;
      },
      onChangeRatio: (value: number) => {
        this.audioNode.ratio.value = value;
      },
      onChangeAttack: (value: number) => {
        this.audioNode.attack.value = value;
      },
    };
  }
}
