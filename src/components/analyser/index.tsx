import React, { Component } from 'react';
import { audioManager, AudioManagerContext } from '../../providers/audio';
import { AudioVisualiser } from './visualizer';

export class Analyser extends Component<
  { bars: boolean },
  { audioData: Uint8Array }
> {
  static contextType = AudioManagerContext;
  audioContext: AudioContext | undefined;
  analyser: AnalyserNode | undefined;
  dataArray: Uint8Array | undefined;
  source: MediaStreamAudioSourceNode | undefined;
  rafId: number | undefined;

  constructor(props: { audio: MediaStream }) {
    super(props);
    this.state = { audioData: new Uint8Array(0) };
  }

  componentDidMount = async () => {
    // const audio = await navigator.mediaDevices.getUserMedia({
    //   audio: true,
    //   video: false,
    // });
    // this.audioContext = new AudioContext();
    // this.analyser = audioManager.getChannel(1)?.audioContext.createAnalyser();
    // this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    // // this.source = this.audioContext.createMediaStreamSource(audio);
    // audioManager.getChannel(1).source.connect(this.analyser);
    // this.rafId = requestAnimationFrame(this.tick);
  };

  tick = () => {
    if (this.props.bars) {
      this.analyser!.getByteFrequencyData(this.dataArray!);
    } else {
      this.analyser!.getByteTimeDomainData(this.dataArray!);
    }
    this.setState({ audioData: this.dataArray! });
    this.rafId = requestAnimationFrame(this.tick);
  };

  updateStep = (e) => {
    const value = e.currentTarget.value;
    this.step = value;
    this.updateAnalyser();
  };

  updateChannel = (e) => {
    const value = e.currentTarget.value;
    this.channelId = value;
    this.step = null;
    this.updateAnalyser();
  };

  updateAnalyser = () => {
    this.analyser = audioManager
      .getChannel(this.channelId)
      ?.audioContext.createAnalyser();
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.source =
      !this.step || this.step === 'source'
        ? audioManager.getChannel(this.channelId).source
        : audioManager.getChannel(this.channelId)?.audioNodes[this.step].output;

    this.audioNodes = [
      'source',
      ...Object.keys(audioManager.getChannel(this.channelId)?.audioNodes),
    ];

    this.source.connect(this.analyser);

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
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>

        <select onChange={this.updateStep}>
          {this.audioNodes &&
            this.audioNodes.map((audioNode) => (
              <option value={audioNode}>{audioNode}</option>
            ))}
        </select>
      </div>
    );
  }
}
