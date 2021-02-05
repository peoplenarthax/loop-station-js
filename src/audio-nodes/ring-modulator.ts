import { IAudioNode } from './audio-node.base';
import { DiodeNode } from './DiodeNode';

export class DubDelay extends IAudioNode {
  private outputNode!: GainNode;
  private vOsc!: OscillatorNode;
  private vOscGain!: GainNode;
  private vOscInverter1!: GainNode;
  private vOscInverter2!: GainNode;
  private vOscDiode1!: DiodeNode;
  private vOscDiode2!: DiodeNode;
  private vOscInverter3!: GainNode;
  private vcInverter1!: GainNode;
  private vcDiode2!: DiodeNode;
  private vcDiode1!: DiodeNode;
  private compressor!: any;
  private inputNode!: GainNode;
  private diodes!: DiodeNode[];

  constructor(audioContext: AudioContext) {
    super('ring-modulator', audioContext);

    this.createNodes();
    this.connectNodes();
  }

  createNodes() {
    this.inputNode = this.audioContext.createGain();
    this.outputNode = this.audioContext.createGain();

    this.vOsc = this.audioContext.createOscillator();
    this.vOsc.start(0);

    this.vOscGain = this.audioContext.createGain();
    this.vOscGain.gain.value = 0.5;
    this.vOscInverter1 = this.audioContext.createGain();
    this.vOscInverter1.gain.value = -1;
    this.vOscInverter2 = this.audioContext.createGain();
    this.vOscInverter2.gain.value = -1;
    this.vOscDiode1 = new DiodeNode(this.audioContext);
    this.vOscDiode2 = new DiodeNode(this.audioContext);
    this.vOscInverter3 = this.audioContext.createGain();
    this.vOscInverter3.gain.value = -1;

    this.vcInverter1 = this.audioContext.createGain();
    this.vcInverter1.gain.value = -1;
    this.vcDiode1 = new DiodeNode(this.audioContext);
    this.vcDiode2 = new DiodeNode(this.audioContext);

    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.value = -24;
    this.compressor.ratio.value = 16;

    this.diodes = [
      this.vOscDiode1,
      this.vOscDiode2,
      this.vcDiode1,
      this.vcDiode2,
    ];
  }

  connectNodes() {
    // Voice input road
    this.inputNode.connect(this.outputNode);
    this.inputNode.connect(this.vcInverter1);
    this.inputNode.connect(this.vcDiode2.audioNode);
    this.vcInverter1.connect(this.vcDiode1.audioNode);
    this.vcDiode1.connect(this.compressor);
    this.vcDiode2.connect(this.compressor);
    this.compressor.connect(this.outputNode);

    // Oscillator road
    this.vOsc.connect(this.vOscGain);
    this.vOscGain.connect(this.vOscInverter1);
    this.vOscGain.connect(this.vcInverter1);
    this.vOscGain.connect(this.vcDiode2.audioNode);
    this.vOscInverter1.connect(this.vOscInverter2);
    this.vOscInverter1.connect(this.vOscDiode2.audioNode);
    this.vOscInverter2.connect(this.vOscDiode1.audioNode);
    this.vOscDiode1.connect(this.vOscInverter3);
    this.vOscDiode2.connect(this.vOscInverter3);
    this.vOscInverter3.connect(this.compressor);

    this.input = this.inputNode;
    this.output = this.outputNode;
  }

  get props() {
    return {
      distortion: {
        min: 0,
        max: 3000,
        defaultValue: 20,
        step: 20,
        displayName: 'Distortion',
        changeFunction: (distortion: number) => {
          this.diodes.forEach((diode) => diode.setDistortion(distortion));
        },
      },
      speed: {
        min: 0.5,
        max: 50,
        defaultValue: 1,
        step: 0.5,
        displayName: 'Speed',
        changeFunction: (speed: number) => {
          this.vOsc.frequency.value = speed;
        },
      },
    };
  }
}
