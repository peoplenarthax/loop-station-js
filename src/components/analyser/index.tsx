import React, { Component, SyntheticEvent } from 'react';
import type { IChannelManagerContext } from '../../providers/channel';
import type { ChannelId } from '../../managers/AudioManager';
import { audioManager, AudioManagerContext } from '../../providers/audio';
import { AudioVisualiser } from './visualizer';

export class Analyser extends Component<
  { bars: boolean; channels: IChannelManagerContext['channels'] },
  { audioData: Uint8Array }
> {
  channelId: ChannelId = 1;
  static contextType = AudioManagerContext;
  audioContext: AudioContext | undefined;
  analyser: AnalyserNode | undefined;
  dataArray: Uint8Array | undefined;
  source: MediaStreamAudioSourceNode | undefined;
  rafId: number | undefined;
  step: string | undefined;
  audioNodes: string[] = [];

  constructor(props: {
    bars: boolean;
    channels: IChannelManagerContext['channels'];
  }) {
    super(props);
    this.state = { audioData: new Uint8Array(0) };
  }

  tick = () => {
    if (this.props.bars) {
      this.analyser!.getByteFrequencyData(this.dataArray!);
    } else {
      this.analyser!.getByteTimeDomainData(this.dataArray!);
    }
    this.setState({ audioData: this.dataArray! });
    this.rafId = requestAnimationFrame(this.tick);
  };

  updateStep = (e: SyntheticEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    this.step = value;
    this.updateAnalyser();
  };

  updateChannel = (e: SyntheticEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    this.channelId = parseInt(value, 10) as ChannelId;
    this.step = undefined;
    this.updateAnalyser();
  };

  updateAnalyser = () => {
    this.analyser = audioManager
      .getChannel(this.channelId!)
      .audioContext.createAnalyser();
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.source =
      !this.step || this.step === 'source'
        ? audioManager.getChannel(this.channelId!).source
        : audioManager.getChannel(this.channelId!).audioNodes[this.step].output;

    this.audioNodes = [
      'source',
      ...Object.keys(audioManager.getChannel(this.channelId!).audioNodes),
    ];

    this.source?.connect(this.analyser);

    this.rafId = requestAnimationFrame(this.tick);
  };

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId!);
    this.analyser!.disconnect();
    this.source!.disconnect();
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <AudioVisualiser
          bars={this.props.bars}
          audioData={this.state.audioData}
        />

        <select onChange={this.updateChannel} defaultValue="">
          {Object.keys(this.props.channels).map((channelId) => (
            <option key={channelId} value={channelId}>
              {channelId}
            </option>
          ))}
        </select>

        <select onChange={this.updateStep}>
          {this.props.channels[this.channelId] &&
            this.props.channels[this.channelId].map((audioNode) => (
              <option value={audioNode}>{audioNode}</option>
            ))}
        </select>
      </div>
    );
  }
}
