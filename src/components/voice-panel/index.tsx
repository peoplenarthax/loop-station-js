import React, { useCallback, useContext } from 'react';
import { AudioManagerContext } from '../../providers/audio';
import { Range } from '../node-controllers/components';

export const VoicePanel = () => {
  const { audioManager } = useContext(AudioManagerContext);

  const onChange = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      if (audioManager.voiceGain) {
        audioManager.voiceGain.gain.value = parseFloat(e.currentTarget.value);
      }
    },
    [audioManager],
  );

  return (
    <Range min={0} max={3} defaultValue={1} step={0.25} onChange={onChange} />
  );
};
