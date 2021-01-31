import { ReverbController } from '../components/node-controllers/ReverbController';
import { chamber, slinky } from '../sound/impulse';
import { IAudioNode } from './audio-node.base';

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const byteArray = binaryString
    .split('')
    .map((char: string) => char.charCodeAt(0));

  const bytes = new Uint8Array(byteArray);

  return bytes.buffer;
};

const reverbEffect = {
  chamber,
  slinky,
};
export class Reverb extends IAudioNode {
  public component = ReverbController;
  public audioNode: ConvolverNode;

  constructor(audioContext: AudioContext) {
    super('reverb', audioContext);
    this.audioNode = audioContext.createConvolver();

    this.input = this.audioNode;
    this.output = this.audioNode;

    this.initAudioNode();
  }

  initAudioNode = async () => {
    this.audioNode.buffer = await this.audioContext.decodeAudioData(
      base64ToArrayBuffer(chamber),
    );
    this.audioNode.normalize = true;
  };

  get props() {
    return {
      onChange: this.setEffect,
    };
  }

  setEffect = async (effect: string) => {
    console.log(effect);
    this.audioNode.buffer = await this.audioContext.decodeAudioData(
      base64ToArrayBuffer(reverbEffect[effect as keyof typeof reverbEffect]),
    );
  };
}
