import React, { createContext, useReducer, useState } from 'react';
import { AudioNodeName } from '../managers/ChannelManager';
import { AudioManager } from '../managers/AudioManager';

type IAudioManagerContext = {
  channels: {
    1: string[];
    2: string[];
    3: string[];
    4: string[];
    5: string[];
  };
  options: AudioNodeName[];
};

const initState = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
};
export const audioManager = new AudioManager();
export const ChannelManagerContext = createContext<IAudioManagerContext>({
  options: [
    AudioNodeName.reverb,
    AudioNodeName.lowpass,
    AudioNodeName.highpass,
    AudioNodeName.lowshelf,
    AudioNodeName.highshelf,
    AudioNodeName.pingpong,
    AudioNodeName.gain,
    AudioNodeName.compressor,
    AudioNodeName.ringmodulator,
  ],
  channels: initState,
});

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'add':
      return {
        ...state,
        [payload.channelId]: [...state[payload.channelId], payload.filter],
      };
    default:
      throw new Error('No real action');
  }
};

export const ChannelProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);

  console.log(state);
  return (
    <ChannelManagerContext.Provider
      value={{
        channels: state,
        addFilter: (channelId, filter) => {
          dispatch({ type: 'add', payload: { channelId, filter } });
        },
        options: [
          AudioNodeName.reverb,
          AudioNodeName.lowpass,
          AudioNodeName.highpass,
          AudioNodeName.lowshelf,
          AudioNodeName.highshelf,
          AudioNodeName.pingpong,
          AudioNodeName.gain,
          AudioNodeName.compressor,
          AudioNodeName.ringmodulator,
        ],
      }}
    >
      {children}
    </ChannelManagerContext.Provider>
  );
};
