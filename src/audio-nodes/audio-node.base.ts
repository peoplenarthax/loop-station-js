import type { ReactNode } from 'react';
import { DynamicController } from '../components/node-controllers/DynamicController';

type ISpecs = {
  [k: string]: {
    displayName: string;
    min: number;
    max: number;
    defaultValue: number;
    step?: number;
    changeFunction: (value: number) => void;
  };
};

let nodeCount = 0;
export class IAudioNode {
  public audioContext: AudioContext;
  public name: string;
  public input!: AudioNode;
  public output!: AudioNode;
  public component: ReactNode = DynamicController;

  constructor(name: string, audioContext: AudioContext) {
    this.name = `${name}${nodeCount++}`;
    this.audioContext = audioContext;
  }

  initAudioNode = async () => {};

  get props(): ISpecs {
    return {};
  }
}
