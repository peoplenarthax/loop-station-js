import React, { Component, SyntheticEvent } from 'react';
import type { IChannelManagerContext } from '../../providers/channel';
import type { ChannelId } from '../../managers/AudioManager';
import { audioManager, AudioManagerContext } from '../../providers/audio';
import { AudioVisualiser } from './visualizer';

type AnalyserProps = {
  bars: boolean;
  channels: IChannelManagerContext['channels'];
  selectedChannel: ChannelId;
  selectedFilter: string;
};
export class Analyser extends Component<
  AnalyserProps,
  { audioData: Uint8Array }
> {
  static contextType = AudioManagerContext;
  audioContext: AudioContext | undefined;
  analyser: AnalyserNode | undefined;
  dataArray: Uint8Array | undefined;
  source: AudioNode | undefined;
  rafId: number | undefined;
  step: string | undefined;
  audioNodes: string[] = [];

  constructor(props: {
    bars: boolean;
    channels: IChannelManagerContext['channels'];
    selectedChannel: ChannelId;
    selectedFilter: string;
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

  componentDidUpdate = (prevProps: AnalyserProps) => {
    if (
      prevProps.selectedChannel !== this.props.selectedChannel ||
      prevProps.selectedFilter !== this.props.selectedFilter
    ) {
      this.updateAnalyser();
    }
  };

  updateAnalyser = () => {
    this.analyser = audioManager
      .getChannel(this.props.selectedChannel!)
      .audioContext.createAnalyser();
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.source =
      !this.step || this.step === 'source'
        ? audioManager.getChannel(this.props.selectedChannel).source
        : audioManager.getChannel(this.props.selectedChannel).getNode(this.step)
            .output;

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
      </div>
    );
  }
}
