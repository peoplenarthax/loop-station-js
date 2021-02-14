import { NodeSplicer } from './NodeSplicer';
import type { AudioNodeName } from './constants';

type ChannelConstructor = {
  context: AudioContext;
  source: MediaElementAudioSourceNode;
};

export class Channel {
  public source: MediaElementAudioSourceNode;
  public audioContext: AudioContext;
  public wetGain: GainNode;
  public nodeSplicer: NodeSplicer;
  public syncNode!: DelayNode; // We use this node to compensate the delay of mic when overdubbing

  constructor({ context, source }: ChannelConstructor) {
    this.source = source;
    this.audioContext = context;

    this.nodeSplicer = new NodeSplicer(this.audioContext);
    this.wetGain = this.nodeSplicer.output;
    this.source.connect(this.nodeSplicer.input);
    this.nodeSplicer.output.connect(this.audioContext.destination);
  }

  setSource(audio: HTMLMediaElement) {
    this.source = this.audioContext.createMediaElementSource(audio);

    this.syncNode = this.audioContext.createDelay();
    this.syncNode.delayTime.value = 0.2;
    this.source.connect(this.syncNode);

    this.source.connect(this.nodeSplicer.input);

    this.nodeSplicer.applyFilters();
  }

  play = async () => {
    this.source.mediaElement.loop = true;
    this.source.mediaElement.play();
  };

  stopAudio = () => {
    this.source.mediaElement.pause();
    this.source.mediaElement.currentTime = 0;
  };

  addAudioNode(audioNodeName: AudioNodeName): string {
    return this.nodeSplicer.addNode(audioNodeName);
  }

  removeAudioNode(nodeName: string) {
    this.nodeSplicer.removeAudioNode(nodeName);
  }

  getAudioNodeComponent(name: string) {
    return {
      component: this.nodeSplicer.audioNodes[name].component,
      props: this.nodeSplicer.audioNodes[name].props,
    };
  }

  getNode(name: string) {
    return this.nodeSplicer.audioNodes[name];
  }
}
