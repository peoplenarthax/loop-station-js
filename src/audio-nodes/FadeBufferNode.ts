export class FadeBuffer {
  private audioContext: AudioContext;
  public buffer: AudioBuffer;
  private activeLength: number;
  private fadeLength: number;
  private fadeTime: number;

  constructor(audioContex: AudioContext, activeTime: number, fadeTime: number) {
    this.audioContext = audioContex;

    this.fadeTime = fadeTime;
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

    const fadeRate = this.fadeTime * this.audioContext.sampleRate;

    const fadeStart = fadeRate;
    const fadeEnd = this.activeLength - fadeRate;

    for (let i = 0; i < this.activeLength; i++) {
      let value;

      if (i < fadeStart) {
        value = Math.sqrt(i / fadeRate);
      } else if (i >= fadeEnd) {
        value = Math.sqrt(1 - (i - fadeEnd) / fadeRate);
      } else {
        value = 1;
      }

      channelValue[i] = value;
    }

    for (let i = fadeStart; i < length; i++) {
      channelValue[i] = 0;
    }
  }
}
