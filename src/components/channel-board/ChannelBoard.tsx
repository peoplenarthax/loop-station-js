import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChannelManagerContext } from '../../providers/channel';
import styled from 'styled-components';
import { AudioNodeName, ChannelNode } from '../../managers/ChannelManager';
import { AudioManagerContext } from '../../providers/audio';
import { Name } from '../node-controllers/components';
import { ReverbController } from '../node-controllers/ReverbController';
import { TogglePlayButton } from '../toggle-play-button';
import type { ChannelId } from 'src/managers/AudioManager';

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

const Button = styled.button`
  height: 30px;
  width: 30px;
  border: none;
  background-color: #fafafa;
  background: linear-gradient(145deg, #ffffff, #e1e1e1);
  box-shadow: 3px 3px 6px #d5d5d5, -3px -3px 6px #ffffff;
`;

export const ChannelBoard = ({ channelId }: { channelId: ChannelId }) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const { audioManager } = useContext(AudioManagerContext);
  const { channels, addFilter, removeFilter, options } = useContext(
    ChannelManagerContext,
  );

  const channelManager = audioManager.getChannel(channelId);

  const removeNode = (node: string) => () => {
    removeFilter(channelId, node);
    channelManager?.removeAudioNode(node);
  };

  return (
    <>
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

            <Controller.component specs={Controller.props} />
          </div>
        );
      })}

      <TogglePlayButton
        onPlay={audioManager.play(channelId)}
        onStop={audioManager.stopAudio(channelId)}
      />
    </>
  );
};
