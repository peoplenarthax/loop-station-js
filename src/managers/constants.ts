import {
  DubDelay,
  DynamicCompressor,
  Gain,
  Highpass,
  Highshelf,
  IAudioNode,
  Lowpass,
  Lowshelf,
  PingPong,
  PitchShift,
  Reverb,
  FoldbackDistortion,
  BitCrusher,
} from '../audio-nodes';

export enum AudioNodeName {
  reverb = 'reverb',
  lowpass = 'lowpass',
  highpass = 'highpass',
  highshelf = 'highshelf',
  pingpong = 'pingpong',
  gain = 'gain',
  compressor = 'compressor',
  lowshelf = 'lowshelf',
  ringmodulator = 'ringmodulator',
  pitchshift = 'pitchshift',
  foldbackdistortion = 'foldbackdistortion',
  bitcrusher = 'bitcrusher',
}

// const createAudioNode = (AudioNode: AudioNode) => (context: AudioContext) =>
//   AudioNode;
export const NODE_MAP: {
  [key in AudioNodeName]: (context: AudioContext) => IAudioNode;
} = {
  reverb: (context: AudioContext) => new Reverb(context),
  lowpass: (context: AudioContext) => new Lowpass(context),
  highpass: (context: AudioContext) => new Highpass(context),
  highshelf: (context: AudioContext) => new Highshelf(context),
  pingpong: (context: AudioContext) => new PingPong(context),
  gain: (context: AudioContext) => new Gain(context),
  compressor: (context: AudioContext) => new DynamicCompressor(context),
  lowshelf: (context: AudioContext) => new Lowshelf(context),
  ringmodulator: (context: AudioContext) => new DubDelay(context),
  pitchshift: (context: AudioContext) => new PitchShift(context),
  foldbackdistortion: (context: AudioContext) =>
    new FoldbackDistortion(context),
  bitcrusher: (context: AudioContext) => new BitCrusher(context),
};
