import type { IAudioNode } from '../audio-nodes';
import { AudioNodeName, NODE_MAP } from './constants';

export class NodeSplicer {
  private audioContext: AudioContext;
  public audioNodes: Record<string, IAudioNode>;
  public nodes: string[];
  public input: GainNode;
  public output: GainNode;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.audioNodes = {};
    this.nodes = [];

    this.input = this.audioContext.createGain();
    this.output = this.audioContext.createGain();
  }

  addNode = (audioNodeName: AudioNodeName): string => {
    const audioNode = NODE_MAP[audioNodeName](this.audioContext);
    this.audioNodes[audioNode.name] = audioNode;

    // Disconnect the last filter from the audioContext output
    if (this.nodes.length > 0) {
      this.audioNodes[this.nodes[this.nodes.length - 1]].output.disconnect(
        this.output,
      );
    } else {
      // Disconnect source from output
      this.input.disconnect(this.output);
    }

    this.nodes.push(audioNode.name);

    // Connect all filters
    this.applyFilters();

    return audioNode.name;
  };

  // TODO: Refactor remove
  removeAudioNode(nodeName: string) {
    const filters = Object.keys(this.audioNodes);
    const index = filters.findIndex((key) => key === nodeName);

    this.nodes = this.nodes.filter((node) => node != nodeName);

    if (index === 0) {
      if (filters.length === 1) {
        this.input.disconnect(this.audioNodes[nodeName].input);

        delete this.audioNodes[nodeName];

        this.input.connect(this.output);
        return;
      }
      this.input.disconnect(this.audioNodes[nodeName].input);

      delete this.audioNodes[nodeName];

      this.input.connect(this.audioNodes[filters[1]].input);
      return;
    }

    if (index !== filters.length - 1) {
      this.audioNodes[filters[index - 1]].output.disconnect(
        this.audioNodes[nodeName].input,
      );

      delete this.audioNodes[nodeName];

      this.audioNodes[filters[index - 1]].output.connect(
        this.audioNodes[filters[index + 1]].input,
      );
      return;
    }

    this.audioNodes[filters[index - 1]].output.disconnect(
      this.audioNodes[nodeName].input,
    );

    delete this.audioNodes[nodeName];

    this.audioNodes[filters[index - 1]].output.connect(this.output);
  }

  applyFilters = () => {
    if (this.nodes.length === 0) {
      this.input.connect(this.output);
      return;
    }

    for (let id = 0; id < this.nodes.length; id++) {
      const nodeToConnectId = id - 1;

      if (nodeToConnectId < 0) {
        this.input.connect(this.audioNodes[this.nodes[id]].input);
        continue;
      }

      this.audioNodes[this.nodes[nodeToConnectId]].output.connect(
        this.audioNodes[this.nodes[id]].input,
      );
    }

    this.audioNodes[this.nodes[this.nodes.length - 1]].output.connect(
      this.output,
    );
  };
}
