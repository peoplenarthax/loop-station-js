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
  public audioContext: AudioContext | undefined;
  public audioDestination: MediaStreamAudioDestinationNode | undefined;
  private audioBuffer: BlobPart[] = [];
  private recordingBuffer: BlobPart[] = [];
  private audio: HTMLAudioElement[] = [];
  private channel: Channel[] = [];
  private inputVoice!: MediaStreamAudioSourceNode;
  public voiceGain!: GainNode;
  private voiceDestination!: MediaStreamAudioDestinationNode;

  constructor(channelsAmount: number) {
    this.channelsAmount = channelsAmount;
  }

  init = () => {
    this.audioContext = new AudioContext();
    this.audioDestination = this.audioContext.createMediaStreamDestination();

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((audioStream: MediaStream) => {
        this.inputVoice = this.audioContext!.createMediaStreamSource(
          audioStream,
        );

        this.voiceGain = this.audioContext!.createGain();
        this.voiceDestination = this.audioContext!.createMediaStreamDestination();

        this.mediaRecorder = new MediaRecorder(this.voiceDestination.stream);

        this.mediaRecorder.ondataavailable = (e: MessageEvent<BlobPart>) => {
          this.audioBuffer.push(e.data);
        };

        this.inputVoice.connect(this.voiceGain);
        this.voiceGain.connect(this.voiceDestination);
      });

    for (let i = 1; i <= this.channelsAmount; i++) {
      this.audio[i] = new Audio();
      const source = this.audioContext.createMediaElementSource(this.audio[i]);

      const channel = new Channel({ source, context: this.audioContext });
      this.channel[i] = channel;

      this.channel[i]?.wetGain.connect(this.audioDestination);
    }
  };

  recordAllChannels = () => {
    if (this.audioDestination) {
      this.channelRecorder = new MediaRecorder(this.audioDestination.stream);

      this.channelRecorder.ondataavailable = (e: MessageEvent<BlobPart>) => {
        this.recordingBuffer.push(e.data);
      };

      this.channelRecorder.onstop = () => {
        const blob = new Blob(this.recordingBuffer, {
          type: 'audio/flac; codecs=flac',
        });

        this.recordingBuffer = [];

        window.open(URL.createObjectURL(blob));
      };

      this.channelRecorder.start();
    }
  };

  stopRecordingAllChannels = () => {
    this.channelRecorder.stop();
  };

  record = () => {
    this.mediaRecorder.start();
  };

  stopRecording = (channelId: ChannelId) => {
    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.audioBuffer, {
        type: 'audio/flac; codecs=flac',
      });
      this.audioBuffer = [];

      const audioUrl = URL.createObjectURL(blob);
      this.audio[channelId].pause();
      this.audio[channelId] = new Audio(audioUrl);

      this.createChannel(channelId);
    };

    this.mediaRecorder.stop();
  };

  overdub = (channelId: ChannelId) => {
    if (Number.isNaN(this.audio[channelId].duration)) {
      return;
    }

    this.channel[channelId].syncNode.connect(this.voiceDestination);

    this.audio[channelId].play();
    this.audio[channelId].loop = false;

    this.mediaRecorder.start(this.audio[channelId].duration * 1000);

    this.audio[channelId].onended = () => {
      this.stopRecording(channelId);
      this.channel[channelId].syncNode.disconnect(this.voiceDestination);
    };
  };

  startAllChannels = () => {
    this.channel.forEach((channel) => {
      channel.play();
    });
  };

  stopAllChannels = () => {
    this.channel.forEach((channel) => {
      channel.stopAudio();
    });
  };

  createChannel = (channelId: ChannelId) => {
    this.channel[channelId].setSource(this.audio[channelId]!);
  };

  uploadAudioToChannel = (channelId: ChannelId, file: File) => {
    const audioElement = new Audio(URL.createObjectURL(file));

    this.audio[channelId] = audioElement;
    this.channel[channelId].setSource(this.audio[channelId]);
  };

  hasChannel = (channelId: ChannelId): boolean => {
    return !!this.channel[channelId];
  };

  getChannel = (channelId: ChannelId): Channel => {
    return this.channel[channelId];
  };

  changeSpeed = (channelId: ChannelId) => (speed: number) => {
    if (this.audio[channelId]) {
      this.audio[channelId].playbackRate = speed;
    }
  };
}
