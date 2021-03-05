import React, { useCallback, useContext, useRef, useState } from 'react';
import Hotkeys from 'react-hot-keys';
import styled, { keyframes, css } from 'styled-components';
import { ChannelManagerContext } from '../../providers/channel';
import { AudioManagerContext } from '../../providers/audio';
import type { ChannelId } from '../../managers/AudioManager';
import { useToggle } from '../../hooks/use-toggle';
import { AudioNodeName } from '../../managers/constants';
import { TogglePlayButton } from '../toggle-play-button';
import { ToggleRecButton } from '../toggle-rec-button';
import { SpeedController } from '../node-controllers/SpeedController';
import { Name } from '../node-controllers/components';
import { CommonCircularButton } from '../common';

const BoardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  padding: 8px;
  border-radius: 7px;
  background: #fafafa;
  box-shadow: 8px 8px 16px #d5d5d5, -8px -8px 16px #ffffff;
  margin-bottom: 30px;
`;

const Select = styled.select`
  font-weight: bold;
  color: #9a9a9a;
  border: none;
  border-radius: 4px;
  padding: 6px 16px;
  margin-right: 10px;
  background: #fafafa;
  box-shadow: inset 3px 3px 6px #d5d5d5, inset -3px -3px 6px #ffffff;
  appearance: none;
`;

const fade = keyframes`
0% {
  opacity: 0;
}

100% {
  opacity: 1;
}`;

const animation = css`
  animation: ${fade} 500ms linear forwards;
`;

// TODO: use common button
const Button = styled.button`
  height: 30px;
  width: 30px;
  border: none;
  background-color: #fafafa;
  background: linear-gradient(145deg, #ffffff, #e1e1e1);
  box-shadow: 3px 3px 6px #d5d5d5, -3px -3px 6px #ffffff;
`;

const DropZone = styled.div<{ over?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  height: 44px;
  opacity: 0;
  border-radius: 8px;
  background-color: #f0f1fc;
  font-weight: bold;
  border: dashed 2px #d0d1dc;

  ${animation};
`;

export const ChannelBoard = ({ channelId }: { channelId: ChannelId }) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const { audioManager } = useContext(AudioManagerContext);
  const [playing, togglePlaying] = useToggle(false);
  const [recording, toggleRecording] = useToggle(false);
  const [isDragover, setIsDragOver] = useState(false);
  const { channels, addFilter, removeFilter, options } = useContext(
    ChannelManagerContext,
  );

  const channelManager = audioManager.getChannel(channelId);

  const removeNode = (node: string) => () => {
    removeFilter(channelId, node);
    channelManager?.removeAudioNode(node);
  };

  const onHotKeyPlay = useCallback(() => {
    if (playing) {
      channelManager.stopAudio();
    } else {
      channelManager.play();
    }

    togglePlaying();
  }, [playing]);

  const onHotKeyRec = useCallback(() => {
    if (recording) {
      audioManager.stopRecording(channelId);
    } else {
      audioManager.record();
    }

    toggleRecording();
  }, [recording]);

  const onDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragOver(false);
    const audioFile = e.dataTransfer?.files[0];

    if (audioFile) {
      audioManager.uploadAudioToChannel(channelId, audioFile);
    }
  };

  return (
    <>
      <div
        style={{
          width: '75%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
      >
        {isDragover && <DropZone>Drop audio here!</DropZone>}
        {!isDragover && (
          <>
            <Hotkeys
              keyName={`shift+${channelId}`}
              onKeyDown={onHotKeyRec}
              onKeyUp={onHotKeyRec}
            >
              <ToggleRecButton onClick={onHotKeyRec} isRecording={recording} />
            </Hotkeys>

            <Hotkeys
              keyName={`alt+${channelId}`}
              onKeyDown={() => {
                audioManager.overdub(channelId);
              }}
            >
              <CommonCircularButton
                onClick={() => {
                  audioManager.overdub(channelId);
                }}
              >
                Over
              </CommonCircularButton>
            </Hotkeys>

            <Hotkeys keyName={`${channelId}`} onKeyDown={onHotKeyPlay}>
              <TogglePlayButton
                channelId={channelId}
                isPlaying={playing}
                onClick={onHotKeyPlay}
              />
            </Hotkeys>
          </>
        )}
      </div>

      <SpeedController onChangeSpeed={audioManager.changeSpeed(channelId)} />

      <BoardContainer>
        <Select ref={selectRef} defaultValue={AudioNodeName.reverb}>
          {options.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
        <Button
          disabled={options.length === 0}
          onClick={() => {
            const controllerId = channelManager.addAudioNode(
              selectRef.current!.value as AudioNodeName,
            );
            addFilter(channelId, controllerId);
          }}
        >
          +
        </Button>
      </BoardContainer>

      {channels[channelId].map((filter) => {
        const Controller = channelManager!.getAudioNodeComponent(filter);

        if (!Controller.component) return null;

        return (
          <div key={filter}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Name>{filter.replace(/\d/g, '')}</Name>
              <Button onClick={removeNode(filter)}>☠</Button>
            </div>
            {/* @ts-ignore */}
            <Controller.component specs={Controller.props} />
          </div>
        );
      })}
    </>
  );
};
