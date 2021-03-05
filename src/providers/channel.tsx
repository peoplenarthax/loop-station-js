import React, { createContext, useReducer, useState } from 'react';
import { AudioNodeName } from '../managers/constants';
import type { ChannelId } from '../managers/AudioManager';
import { Actions, Channels, initState, reducer } from './channels.reducer';

export type IChannelManagerContext = {
  channels: Channels;
  options: readonly AudioNodeName[];
  addFilter: (channelId: ChannelId, filter: string) => void;
  removeFilter: (channelId: ChannelId, filter: string) => void;
};

const options = [
  AudioNodeName.reverb,
  AudioNodeName.lowpass,
  AudioNodeName.highpass,
  AudioNodeName.lowshelf,
  AudioNodeName.highshelf,
  AudioNodeName.pingpong,
  AudioNodeName.gain,
  AudioNodeName.compressor,
  AudioNodeName.ringmodulator,
  AudioNodeName.pitchshift,
  AudioNodeName.foldbackdistortion,
  AudioNodeName.bitcrusher,
  AudioNodeName.reversedelay,
] as const;

export const ChannelManagerContext = createContext<IChannelManagerContext>({
  channels: initState,
  options,
  addFilter: () => {},
  removeFilter: () => {},
});

export const ChannelProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <ChannelManagerContext.Provider
      value={{
        channels: state,
        options,
        addFilter: (channelId, filter) => {
          dispatch({
            type: Actions.ADD_FILTER,
            payload: { channelId, filter },
          });
        },
        removeFilter: (channelId, filter) => {
          dispatch({
            type: Actions.REMOVE_FILTER,
            payload: { channelId, filter },
          });
        },
      }}
    >
      {children}
    </ChannelManagerContext.Provider>
  );
};
