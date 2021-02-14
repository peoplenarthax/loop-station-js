import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { useToggle } from '../../hooks/use-toggle';
import { AudioManagerContext } from '../../providers/audio';
import { Button } from '../common';

const Wrapper = styled.div`
  grid-column: 3;
  display: flex;
  flex-direction: column;
`;

const RecordingButton = styled(Button)`
  padding: 8px;
  max-height: 20px;
  box-sizing: content-box;

  margin-bottom: 20px;
`;
export const RecordingPanel = () => {
  const { audioManager } = useContext(AudioManagerContext);
  const [isRecording, toggleRecording] = useToggle(false);
  const [isPlaying, togglePlaying] = useToggle(false);

  const onClickRecord = useCallback(() => {
    if (isRecording) {
      audioManager.stopRecordingAllChannels();
    } else {
      audioManager.recordAllChannels();
    }
    toggleRecording();
  }, [isRecording]);

  const onClickPlay = useCallback(() => {
    if (isPlaying) {
      audioManager.stopAllChannels();
    } else {
      audioManager.startAllChannels();
    }
    togglePlaying();
  }, [isPlaying]);

  return (
    <Wrapper>
      <RecordingButton onClick={onClickRecord}>
        {!isRecording ? 'Record' : 'Save'}
      </RecordingButton>
      <RecordingButton onClick={onClickPlay}>
        {!isPlaying ? 'Start all' : 'Stop all'}
      </RecordingButton>
    </Wrapper>
  );
};
