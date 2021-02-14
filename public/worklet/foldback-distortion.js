class FoldbackDistortion extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'cutOff',
        defaultValue: 1,
        minValue: 0,
        maxValue: 2,
      },
    ];
  }

  constructor() {
    super();
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const cutOff = parameters.cutOff[0];

    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];

      for (let i = 0; i < inputChannel.length; i++) {
        let input = Math.abs(inputChannel[i]);
        if (cutOff === 0) {
          outputChannel[i] = input;
          continue;
        }
        // output = cutOff - (input - cutOff)
        while (input >= cutOff) {
          input = Math.abs(cutOff - (input - cutOff));
        }

        outputChannel[i] = input;
      }
    }

    return true;
  }
}

registerProcessor('foldback-distortion', FoldbackDistortion);
