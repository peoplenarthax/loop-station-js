import { IAudioNode } from './audio-node.base';
import { DelayBuffer } from './DelayTimeBuffer';
import { FadeBuffer } from './FadeBufferNode';

export class PitchShift extends IAudioNode {
  shiftDownBuffer: any;
  shiftUpBuffer: any;
  mod1!: AudioBufferSourceNode;
  mod2!: AudioBufferSourceNode;
  mod1Gain!: GainNode;
  mod2Gain!: GainNode;
  mod3Gain!: GainNode;
  mod4Gain!: GainNode;
  fadeGain1!: GainNode;
  fadeGain2!: GainNode;
  fade1!: AudioBufferSourceNode;
  fade2!: AudioBufferSourceNode;
  mix1!: GainNode;
  mix2!: GainNode;
  delay1!: DelayNode;
  delay2!: DelayNode;
  delayTime!: number;
  mod3!: AudioBufferSourceNode;
  mod4!: AudioBufferSourceNode;
  fadeTime!: number;
  bufferTime!: number;

  constructor(audioContext: AudioContext) {
    super('pitchShift', audioContext);

    this.createNodes();
    this.connectNodes();
    this.start();
  }

  createNodes = () => {
    this.delayTime = 0.1;
    this.fadeTime = 0.05;
    this.bufferTime = 0.1;

    this.input = this.audioContext.createGain();
    this.output = this.audioContext.createGain();

    this.shiftDownBuffer = new DelayBuffer(
      this.audioContext,
      this.bufferTime,
      this.fadeTime,
      false,
    ).buffer;

    this.shiftUpBuffer = new DelayBuffer(
      this.audioContext,
      this.bufferTime,
      this.fadeTime,
      true,
    ).buffer;

    // Delay modulation.
    this.mod1 = this.audioContext.createBufferSource();
    this.mod1.buffer = this.shiftDownBuffer;
    this.mod1.loop = true;

    this.mod2 = this.audioContext.createBufferSource();
    this.mod2.buffer = this.shiftDownBuffer;
    this.mod2.loop = true;

    this.mod3 = this.audioContext.createBufferSource();
    this.mod3.buffer = this.shiftUpBuffer;
    this.mod3.loop = true;

    this.mod4 = this.audioContext.createBufferSource();
    this.mod4.buffer = this.shiftUpBuffer;
    this.mod4.loop = true;

    // for switching between oct-up and oct-down
    this.mod1Gain = this.audioContext.createGain();
    this.mod2Gain = this.audioContext.createGain();
    this.mod3Gain = this.audioContext.createGain();
    this.mod3Gain.gain.value = 0;
    this.mod4Gain = this.audioContext.createGain();
    this.mod4Gain.gain.value = 0;

    this.fadeGain1 = this.audioContext.createGain();
    this.fadeGain2 = this.audioContext.createGain();

    this.delay1 = this.audioContext.createDelay();
    this.delay2 = this.audioContext.createDelay();

    const fadeBuffer = new FadeBuffer(
      this.audioContext,
      this.bufferTime,
      this.fadeTime,
    );
    this.fade1 = this.audioContext.createBufferSource();
    this.fade1.buffer = fadeBuffer.buffer;
    this.fade1.loop = true;
    this.fade2 = this.audioContext.createBufferSource();
    this.fade2.buffer = fadeBuffer.buffer;
    this.fade2.loop = true;

    this.mix1 = this.audioContext.createGain();
    this.mix1.gain.value = 0;

    this.mix2 = this.audioContext.createGain();
    this.mix2.gain.value = 0;
  };

  connectNodes = () => {
    this.input.connect(this.delay1);
    this.input.connect(this.delay2);
    this.delay1.connect(this.mix1);
    this.delay2.connect(this.mix2);

    this.mod1.connect(this.mod1Gain);
    this.mod2.connect(this.mod2Gain);
    this.mod3.connect(this.mod3Gain);
    this.mod4.connect(this.mod4Gain);

    this.mod1Gain.connect(this.fadeGain1);
    this.mod2Gain.connect(this.fadeGain2);
    this.mod3Gain.connect(this.fadeGain1);
    this.mod4Gain.connect(this.fadeGain2);

    this.fadeGain1.connect(this.delay1.delayTime);
    this.fadeGain2.connect(this.delay2.delayTime);

    this.fade1.connect(this.mix1.gain);
    this.fade2.connect(this.mix2.gain);

    this.mix1.connect(this.output);
    this.mix2.connect(this.output);
  };

  start = () => {
    const startTime = this.audioContext.currentTime + 0.05;
    const fadingTime = this.bufferTime - this.fadeTime + startTime;
    this.mod1.start(startTime);
    this.fade1.start(startTime);
    this.mod3.start(startTime);

    this.mod2.start(fadingTime);
    this.mod4.start(fadingTime);
    this.fade2.start(fadingTime);

    this.setDelay(this.delayTime);
  };

  setDelay = (delayTime: number) => {
    this.fadeGain1.gain.setTargetAtTime(0.5 * delayTime, 0, 0.05);
    this.fadeGain2.gain.setTargetAtTime(0.5 * delayTime, 0, 0.05);
  };

  get props() {
    return {
      pitch: {
        displayName: 'Pitch',
        min: -1,
        max: 1,
        defaultValue: -1,
        step: 0.05,
        changeFunction: (mult: number) => {
          if (mult > 0) {
            this.mod1Gain.gain.value = 0;
            this.mod2Gain.gain.value = 0;
            this.mod3Gain.gain.value = 1;
            this.mod4Gain.gain.value = 1;
          } else {
            this.mod1Gain.gain.value = 1;
            this.mod2Gain.gain.value = 1;
            this.mod3Gain.gain.value = 0;
            this.mod4Gain.gain.value = 0;
          }
          this.setDelay(this.delayTime * Math.abs(mult));
        },
      },
    };
  }
}
