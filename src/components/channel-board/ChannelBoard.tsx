import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { AudioNodeName, ChannelNode } from '../../managers/ChannelManager';
import { AudioManagerContext } from '../../providers/audio';
import { ReverbController } from '../node-controllers/ReverbController';
import { TogglePlayButton } from '../toggle-play-button';

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

const AddButton = styled.button`
  height: 30px;
  width: 30px;
  border: none;
  background-color: #fafafa;
  background: linear-gradient(145deg, #ffffff, #e1e1e1);
  box-shadow: 3px 3px 6px #d5d5d5, -3px -3px 6px #ffffff;
`;

export const ChannelBoard = ({ channel }: { channel: 1 | 2 | 3 | 4 | 5 }) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const { audioManager } = useContext(AudioManagerContext);
  const [newestNode, setNode] = useState<AudioNodeName>();
  const [options, setOptions] = useState<AudioNodeName[]>([
    AudioNodeName.reverb,
    AudioNodeName.lowpass,
    AudioNodeName.highpass,
    AudioNodeName.highshelf,
    AudioNodeName.pingpong,
  ]);
  const [controllers, setControllers] = useState<string[]>([]);
  const channelManager = audioManager.getChannel(channel);

  useEffect(() => {
    if (!newestNode) return;
    const controller = channelManager?.addAudioNode(newestNode!);
    setControllers([...controllers, controller!]);
  }, [newestNode]);

  console.log(controllers);
  return (
    <>
      <BoardContainer>
        <Select ref={selectRef} defaultValue={AudioNodeName.reverb}>
          {options.map((value) => (
            <option value={value}>{value}</option>
          ))}
        </Select>
        <AddButton
          disabled={options.length === 0}
          onClick={() => {
            setNode(selectRef.current!.value as AudioNodeName);
            setOptions(
              options.filter((option) => option !== selectRef.current!.value),
            );
          }}
        >
          +
        </AddButton>
      </BoardContainer>

      {controllers.map((controller) => {
        const Controller = channelManager!.getAudioNodeComponent(controller);

        if (!Controller.component) return null;

        return <Controller.component {...Controller.props} />;
      })}

      <TogglePlayButton
        onPlay={audioManager.play(channel)}
        onStop={audioManager.stopAudio(channel)}
      />
    </>
  );
};
