import { ThemeConsumer } from 'styled-components';
import { Channel } from './ChannelManager';

export type ChannelId = 1 | 2 | 3 | 4 | 5;
type AudioFilter = {
  source: MediaElementAudioSourceNode;
  reverb: AudioNode;
};

export class AudioManager {
  private channelsAmount: number;
  private mediaRecorder: any;
  private channelRecorder: any;
  private audioContext: AudioContext | undefined;
  private audioDestination: MediaStreamAudioDestinationNode | undefined;
  private audioBuffer: BlobPart[] = [];
  private recordingBuffer: BlobPart[] = [];
  private audio: HTMLAudioElement[] = [];
  private audioFilter: AudioFilter[] = [];
  private channel: Channel[] = [];

  constructor(channelsAmount: number) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((audioStream: MediaStream) => {
        this.mediaRecorder = new MediaRecorder(audioStream);

        this.mediaRecorder.ondataavailable = (e: MessageEvent<BlobPart>) => {
          this.audioBuffer.push(e.data);
        };
      });

    this.channelsAmount = channelsAmount;
  }

  init = () => {
    this.audioContext = new AudioContext();

    this.audioDestination = this.audioContext.createMediaStreamDestination();

    for (let i = 1; i <= this.channelsAmount; i++) {
      const source = this.audioContext.createMediaElementSource(new Audio());

      const channel = new Channel({ source, context: this.audioContext });
      this.channel[i] = channel;

      this.channel[i]?.wetGain.connect(this.audioDestination);
    }
  };

  recordAllChannels = (setDownloadUrl: (url: string) => void) => {
    if (this.audioDestination) {
      this.channelRecorder = new MediaRecorder(this.audioDestination.stream);

      this.channelRecorder.ondataavailable = (e: MessageEvent<BlobPart>) => {
        this.recordingBuffer.push(e.data);
      };

      this.channelRecorder.onstop = () => {
        // TODO: Research AAC export for multi channel
        const blob = new Blob(this.recordingBuffer, {
          type: 'audio/ogg; codecs=opus',
        });

        this.recordingBuffer = [];

        setDownloadUrl(URL.createObjectURL(blob));
      };

      this.channelRecorder.start();
    }
  };

  stopRecordingAllChannels = () => {
    this.channelRecorder.stop();
  };

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
    this.channel[channelId]?.setSource(this.audio[channelId]!);
  };

  hasChannel = (channelId: ChannelId): boolean => {
    return !!this.channel[channelId];
  };

  getChannel = (channelId: ChannelId): Channel => {
    return this.channel[channelId];
  };

  stopRecording = () => {
    this.mediaRecorder.stop();
  };

  changeSpeed = (channelId: ChannelId) => (speed: number) => {
    if (this.audio[channelId]) {
      this.audio[channelId].playbackRate = speed;
    }
  };

  play = (channelId: ChannelId) => async () => {
    if (this.audio[channelId]) {
      this.audio[channelId].loop = true;
      this.audio[channelId].play();
    }
  };

  stopAudio = (channelId: ChannelId) => () => {
    if (this.audio[channelId]) {
      this.audio[channelId].pause();
      this.audio[channelId].currentTime = 0;
    }
  };
}
