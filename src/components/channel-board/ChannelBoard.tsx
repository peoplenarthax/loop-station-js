import React, { useContext } from 'react';
import { AudioManagerContext } from '../../providers/audio';
import { TogglePlayButton } from '../toggle-play-button';
import { ToggleRecButton } from '../toggle-rec-button';

export const ChannelBoard = ({ channel }: { channel: 1 | 2 | 3 | 4 | 5 }) => {
  const { audioManager } = useContext(AudioManagerContext);

  return (
    <>
      <ToggleRecButton
        onRec={() =>
          audioManager.record(
            channel,
            channel % 2 ? 'slinky' : 'impulseResponse',
          )
        }
        onStop={audioManager.stopRecording}
      />
      <TogglePlayButton
        onPlay={audioManager.play(channel)}
        onStop={audioManager.stopAudio(channel)}
      />
    </>
  );
};
