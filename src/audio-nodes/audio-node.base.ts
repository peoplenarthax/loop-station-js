import type { ReactNode } from 'react';

let nodeCount = 0;
export class IAudioNode {
  public audioContext: AudioContext;
  public name: string;
  public input!: AudioNode;
  public output!: AudioNode;
  public component: ReactNode;

  constructor(name: string, audioContext: AudioContext) {
    this.name = `${name}${nodeCount++}`;
    this.audioContext = audioContext;
  }

  initAudioNode = async () => {};

  get props() {
    return {};
  }
}
