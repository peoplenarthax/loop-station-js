import { IAudioNode } from './audio-node.base';

export class PingPong extends IAudioNode {
  private merger!: ChannelMergerNode;
  private leftDelay!: DelayNode;
  private rightDelay!: DelayNode;
  private leftFeedback!: GainNode;
  private rightFeedback!: GainNode;
  private splitter!: ChannelSplitterNode;

  constructor(audioContext: AudioContext) {
    super('pingpong', audioContext);

    this.createEffect();
  }

  createEffect() {
    this.splitter = this.audioContext.createChannelSplitter(2);

    this.leftDelay = this.audioContext.createDelay();
    this.rightDelay = this.audioContext.createDelay();

    this.leftFeedback = this.audioContext.createGain();
    this.rightFeedback = this.audioContext.createGain();

    this.merger = this.audioContext.createChannelMerger(2);

    this.splitter.connect(this.leftDelay, 0);

    this.leftDelay.delayTime.value = 0.3;
    this.rightDelay.delayTime.value = 0.3;

    this.leftFeedback.gain.value = 0.5;
    this.rightFeedback.gain.value = 0.5;

    this.leftDelay.connect(this.leftFeedback);
    this.leftFeedback.connect(this.rightDelay);

    this.rightDelay.connect(this.rightFeedback);
    this.rightFeedback.connect(this.leftDelay);

    this.leftFeedback.connect(this.merger, 0, 0);
    this.rightFeedback.connect(this.merger, 0, 1);

    this.input = this.splitter;
    this.output = this.merger;
  }

  get props() {
    return {
      pingpong: {
        min: 0.01,
        max: 3,
        defaultValue: this.rightDelay.delayTime.value,
        step: 0.01,
        displayName: 'Delay',
        changeFunction: (delay: number) => {
          this.leftDelay.delayTime.value = delay;
          this.rightDelay.delayTime.value = delay;
        },
      },
    };
  }
}
