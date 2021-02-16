class BitCrusher extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'bitDepth',
        defaultValue: 16,
        minValue: 1,
        maxValue: 16,
      },
      {
        name: 'frequencyDownsampling',
        defaultValue: 1,
        minValue: 0.1,
        maxValue: 1,
      },
    ];
  }

  constructor() {
    super();

    this.lastSample;
    this.period = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const resolutionStep = Math.pow(0.5, parameters.bitDepth[0]);
    const frequencyDownsampling = parameters.frequencyDownsampling[0];

    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];

      for (let i = 0; i < inputChannel.length; i++) {
        this.period += frequencyDownsampling;

        if (this.period >= 1) {
          this.lastSample =
            resolutionStep * Math.floor(inputChannel[i] / resolutionStep + 0.5);
          this.period -= 1;
        }

        outputChannel[i] = this.lastSample;
      }
    }

    return true;
  }
}

registerProcessor('bit-crusher', BitCrusher);
