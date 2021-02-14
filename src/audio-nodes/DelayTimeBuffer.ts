export class DelayBuffer {
  private audioContext: AudioContext;
  public buffer: AudioBuffer;
  private activeLength: number;
  private fadeLength: number;
  private fadeTime: number;
  private shiftUp: boolean;

  constructor(
    audioContex: AudioContext,
    activeTime: number,
    fadeTime: number,
    shiftUp: boolean,
  ) {
    this.audioContext = audioContex;

    this.fadeTime = fadeTime;
    this.shiftUp = shiftUp;
    this.activeLength = activeTime * this.audioContext.sampleRate;
    this.fadeLength =
      (activeTime - 2 * fadeTime) * this.audioContext.sampleRate;

    this.buffer = this.audioContext.createBuffer(
      1,
      this.activeLength + this.fadeLength,
      this.audioContext.sampleRate,
    );

    this.init();
  }

  init() {
    const channelValue = this.buffer.getChannelData(0);
    const length = this.activeLength + this.fadeLength;

    for (let i = 0; i < this.activeLength; ++i) {
      if (this.shiftUp) {
        channelValue[i] = (this.activeLength - i) / length;
        continue;
      }
      channelValue[i] = i / this.activeLength;
    }

    // 2nd part
    for (let i = this.activeLength; i < length; ++i) {
      channelValue[i] = 0;
    }
  }
}
