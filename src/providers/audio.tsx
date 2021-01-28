import React, { createContext } from 'react';
import { AudioManager } from '../managers/AudioManager';

type IAudioManagerContext = {
  audioManager: AudioManager;
};

const audioManager = new AudioManager();
export const AudioManagerContext = createContext<IAudioManagerContext>({
  audioManager,
});

export const AudioProvider: React.FC = ({ children }) => {
  return (
    <AudioManagerContext.Provider value={{ audioManager }}>
      {children}
    </AudioManagerContext.Provider>
  );
};
