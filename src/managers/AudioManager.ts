import { Channel } from './ChannelManager';

export type ChannelId = 1 | 2 | 3 | 4 | 5;
type AudioFilter = {
  source: MediaElementAudioSourceNode;
  reverb: AudioNode;
};

export class AudioManager {
  private mediaRecorder: any;
  private audioBuffer: BlobPart[] = [];
  private audio: HTMLAudioElement[] | undefined[] = [];
  private audioFilter: AudioFilter[] = [];
  private channel: Channel[] | undefined[] = [];

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

  record = (channelId: ChannelId) => {
    this.mediaRecorder.start();

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.audioBuffer, {
        type: 'audio/ogg; codecs=opus',
      });
      this.audioBuffer = [];

      const audioUrl = URL.createObjectURL(blob);
      this.audio[channelId]?.pause();
      this.audio[channelId] = new Audio(audioUrl);

      this.createChannel(channelId);
    };
  };

  createChannel = async (channelId: ChannelId) => {
    if (!this.channel[channelId]) {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(
        this.audio[channelId]!,
      );

      const channel = new Channel({ source, context: audioContext });
      this.channel[channelId] = channel;
    } else {
      this.channel[channelId]?.setSource(this.audio[channelId]!);
    }
  };

  hasChannel = (channelId: ChannelId): boolean => {
    return !!this.channel[channelId];
  };

  getChannel = (channelId: ChannelId): Channel | undefined => {
    return this.channel[channelId];
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
