import { GainController } from '../components/node-controllers/GainController';
import { IAudioNode } from './audio-node.base';

export class Gain extends IAudioNode {
  public audioNode: GainNode;
  public component = GainController;

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
      onChangeGain: (value: number) => {
        this.audioNode.gain.value = value;
      },
    };
  }
}
