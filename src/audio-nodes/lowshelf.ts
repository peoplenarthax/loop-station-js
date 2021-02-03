import { ShelfFilterController } from '../components/node-controllers/ShelfFilterController';
import { IAudioNode } from './audio-node.base';

export class Lowshelf extends IAudioNode {
  public audioNode: BiquadFilterNode;
  public component = ShelfFilterController;

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
      onChangeGain: (value: number) => {
        this.audioNode.gain.value = value;
      },
      onChangeFreq: (value: number) => {
        this.audioNode.frequency.value = value;
      },
    };
  }
}
