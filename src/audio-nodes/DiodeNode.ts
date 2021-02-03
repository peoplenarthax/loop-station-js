// DiodeNode based on http://recherche.ircam.fr/pub/dafx11/Papers/66_e.pdf
export class DiodeNode {
  private audioContext: AudioContext;
  public audioNode: WaveShaperNode;
  private vBias: number; // Diode's forward bias voltage
  private vLinear: number; // Diode's voltage threshold when the diode works in the linear zone
  private h: number; // Slope of the linear zone of the diod

  constructor(audioContex: AudioContext) {
    this.audioContext = audioContex;

    this.audioNode = this.audioContext.createWaveShaper();
    this.vBias = 0.2;
    this.vLinear = 0.4;
    this.h = 1;
    this.setCurve();
  }

  setCurve = () => {
    const samples = 1024;
    let wsCurve = new Float32Array(samples);

    wsCurve = wsCurve.map((_, i) => {
      const v = Math.abs((i - samples / 2) / (samples / 2));

      if (v <= this.vBias) {
        return 0;
      }
      if (this.vBias < v && v <= this.vLinear) {
        return (
          this.h *
          (Math.pow(v - this.vBias, 2) / (2 * this.vLinear - 2 * this.vBias))
        );
      }

      return (
        this.h * v -
        this.h * this.vLinear +
        this.h *
          (Math.pow(this.vLinear - this.vBias, 2) /
            (2 * this.vLinear - 2 * this.vBias))
      );
    });

    this.audioNode.curve = wsCurve;
  };

  setDistortion = (distortion: number) => {
    this.h = distortion;

    this.setCurve();
  };

  connect = (destination: AudioNode) => {
    return this.audioNode.connect(destination);
  };
}
