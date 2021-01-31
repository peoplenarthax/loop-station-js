import { LowPassController } from '../components/node-controllers/PassFilterController';
import { IAudioNode } from './audio-node.base';

export class Lowpass extends IAudioNode {
  public audioNode: BiquadFilterNode;
  public component = LowPassController('Lowpass');

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
      onChangeQ: (value: number) => {
        this.audioNode.Q.value = value;
      },
      onChangeFreq: (value: number) => {
        this.audioNode.frequency.value = value;
      },
    };
  }
}
