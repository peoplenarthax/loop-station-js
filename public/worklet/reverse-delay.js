class ReverseDelay extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'delay',
        defaultValue: 44000,
        minValue: 128,
        maxValue: 132000,
      },
    ];
  }

  constructor() {
    super();

    this.delayBuffer = [[], []];
    this.playBuffer = [[], []];
    this.playBufferIndex = [0, 0];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const delayBufferSize = parameters.delay[0];

    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      let outputChannel = output[channel];

      for (let i = 0; i < inputChannel.length; i++) {
        // Fill the delay buffer if
        if (this.delayBuffer[channel].length <= delayBufferSize) {
          this.delayBuffer[channel].push(inputChannel[i]);
        }

        // Move and reverse buffer
        if (this.delayBuffer[channel].length === delayBufferSize) {
          this.playBuffer[channel] = this.delayBuffer[channel];
          this.delayBuffer[channel] = [];
          this.playBufferIndex[channel] = delayBufferSize - 1;
        }

        const index = this.playBufferIndex[channel];
        let sample = inputChannel[i];

        if (this.playBuffer[channel][index]) {
          const fade = 1 / delayBufferSize;
          sample =
            this.playBuffer[channel][index] *
            ((delayBufferSize - index) * fade);
          this.playBufferIndex[channel]--;
          if (this.playBufferIndex[channel] === 1) {
          }
        }

        outputChannel[i] = sample;
      }
    }

    return true;
  }
}

registerProcessor('reverse-delay', ReverseDelay);
