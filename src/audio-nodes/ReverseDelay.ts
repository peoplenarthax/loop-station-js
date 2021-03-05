import { IAudioNode } from './audio-node.base';

// https://www.electrosmash.com/back-talk-reverse-delay/pedals/delay/back-talk-reverse-delay.html
export class ReverseDelay extends IAudioNode {
  public audioNode: AudioWorkletNode;
  wetGain: GainNode;
  dryGain: GainNode;
  effectGain: GainNode;
  inputGain: GainNode;

  constructor(audioContext: AudioContext) {
    super('reverse-delay', audioContext);
    this.audioNode = new AudioWorkletNode(this.audioContext, 'reverse-delay');

    this.inputGain = this.audioContext.createGain();
    this.wetGain = this.audioContext.createGain();
    this.wetGain.gain.value = 2;
    this.dryGain = this.audioContext.createGain();
    this.dryGain.gain.value = 0.5;
    this.effectGain = this.audioContext.createGain();
    this.effectGain.gain.value = 0.5;

    this.input = this.inputGain;
    this.output = this.wetGain;

    this.inputGain.connect(this.dryGain);
    this.inputGain.connect(this.audioNode);

    this.dryGain.connect(this.wetGain);
    this.audioNode.connect(this.effectGain);
    this.effectGain.connect(this.wetGain);
  }

  get props() {
    return {
      delay: {
        step: 128,
        min: 128,
        max: 132000,
        defaultValue: 44000,
        displayName: 'Delay',
        changeFunction: (value: number) => {
          this.audioNode.parameters
            .get('delay')
            ?.setValueAtTime(value, this.audioContext.currentTime);
        },
      },
      mix: {
        step: 0.01,
        min: 0,
        max: 1,
        defaultValue: 0.5,
        displayName: 'Mix',
        changeFunction: (value: number) => {
          this.dryGain.gain.value = 1 - value;
          this.effectGain.gain.value = value;
        },
      },
    };
  }
}
