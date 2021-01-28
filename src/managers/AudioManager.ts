import { impulseResponse, slinky, bath } from './impulse';

type ChannelId = 1 | 2 | 3 | 4 | 5;
type AudioFilter = {
  source: MediaElementAudioSourceNode;
  reverb: AudioNode;
};

const reverbs = {
  impulseResponse,
  slinky,
  bath,
} as const;

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const byteArray = binaryString
    .split('')
    .map((char: string) => char.charCodeAt(0));

  const bytes = new Uint8Array(byteArray);

  return bytes.buffer;
};

export class AudioManager {
  private mediaRecorder: any;
  private audioBuffer: BlobPart[] = [];
  private audio: HTMLAudioElement[] | undefined[] = [];
  private audioFilter: AudioFilter[] = [];
  private audioContext: AudioContext[] | undefined[] = [];

  constructor() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((audioStream: MediaStream) => {
        this.mediaRecorder = new MediaRecorder(audioStream);

        this.mediaRecorder.ondataavailable = (e: MessageEvent<BlobPart>) => {
          this.audioBuffer.push(e.data);
        };
      });
  }

  record = (channelId: ChannelId, reverb = 'impulseResponse') => {
    this.mediaRecorder.start();

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.audioBuffer, {
        type: 'audio/ogg; codecs=opus',
      });
      this.audioBuffer = [];

      const audioUrl = URL.createObjectURL(blob);
      this.audio[channelId] = new Audio(audioUrl);

      this.createAudioFilter(channelId, reverb);
    };
  };

  createAudioFilter = async (
    channelId: ChannelId,
    reverbId: keyof typeof reverbs,
  ) => {
    if (!this.audioContext[channelId]) {
      this.audioContext[channelId] = new AudioContext();
    }

    const source = this.audioContext[channelId]!.createMediaElementSource(
      this.audio[channelId]!,
    );

    let reverb = this.audioContext[channelId]!.createConvolver();
    reverb.buffer = await this.audioContext[channelId]!.decodeAudioData(
      base64ToArrayBuffer(reverbs[reverbId]),
    );

    source.connect(reverb);
    reverb.connect(this.audioContext[channelId]!.destination);

    this.audioFilter[channelId] = {
      source,
      reverb,
    };
  };

  stopRecording = () => {
    this.mediaRecorder.stop();
  };

  play = (channelId: ChannelId) => async () => {
    if (this.audio[channelId]) {
      this.audio[channelId]!.loop = true;
      this.audio[channelId]!.play();
    }
  };

  stopAudio = (channelId: ChannelId) => () => {
    if (this.audio[channelId]) {
      this.audio[channelId]!.pause();
      this.audio[channelId]!.currentTime = 0;
    }
  };
}
