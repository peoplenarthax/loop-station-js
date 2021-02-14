import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ChannelManagerContext } from '../../providers/channel';
import { useToggle } from '../../hooks/use-toggle';
import { Analyser } from '../analyser';
import type { ChannelId } from '../../managers/AudioManager';
import { Select } from '../node-controllers/components';
import { Button } from '../common';

const Container = styled.div`
  width: 100%;
  grid-column: 4 / -1;
  display: grid;
  grid-template-columns: 1fr 260px;
  grid-template-areas: 'control graph';
`;

const CustomSelect = styled(Select)`
  margin-top: 8px;
`;

export const AnalyserPanel = () => {
  const { channels } = useContext(ChannelManagerContext);
  const [selectedChannel, setSelectedChannel] = useState<ChannelId>(1);
  const [selectedFilter, setSelectedFilter] = useState<string>('source');
  const [bars, toggleBars] = useToggle(false);

  const updateChannel = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    setSelectedFilter('source');
    setSelectedChannel(parseInt(e.currentTarget.value, 10) as ChannelId);
  };

  const updateFilter = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.currentTarget.value);
  };
  return (
    <Container>
      <div
        style={{ display: 'flex', flexDirection: 'column', margin: '8px 16px' }}
      >
        <Button onClick={toggleBars}>{bars ? 'Wave' : 'Bars'}</Button>

        <CustomSelect defaultValue={selectedChannel} onChange={updateChannel}>
          {Object.keys(channels).map((channelId) => (
            <option key={channelId} value={channelId}>
              {channelId}
            </option>
          ))}
        </CustomSelect>

        <CustomSelect onChange={updateFilter}>
          {channels[selectedChannel] &&
            ['source', ...channels[selectedChannel]].map((audioNode) => (
              <option value={audioNode}>{audioNode}</option>
            ))}
        </CustomSelect>
      </div>

      <Analyser
        bars={bars}
        channels={channels}
        selectedChannel={selectedChannel}
        selectedFilter={selectedFilter}
      />
    </Container>
  );
};
