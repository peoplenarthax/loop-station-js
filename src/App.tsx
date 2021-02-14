import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AnalyserPanel } from './components/analysis-panel';
import { ChannelBoard } from './components/channel-board/ChannelBoard';
import { Button } from './components/common';
import { RecordingPanel } from './components/recoring-panel';
import { VoicePanel } from './components/voice-panel';
import { useToggle } from './hooks/use-toggle';
import type { ChannelId } from './managers/AudioManager';
import { AudioManagerContext } from './providers/audio';
import { ChannelManagerContext } from './providers/channel';

const Grid = styled.main`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 220px 1fr;
  grid-template-areas:
    'general general general general general'
    'channel1 channel2 channel3 channel4 channel5';
  grid-row-gap: 20px;
  max-width: 1050px;
  margin: 20px auto;
`;

const Channel = styled.article<{ channelId: ChannelId }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-area: ${({ channelId }) => `channel${channelId}`};
  margin: 0 16px;
  & > * {
    margin-bottom: 20px;
  }
`;

const TurnOnButton = styled(Button)`
  max-height: 30px;
  padding: 8px;
  display: flex;
  align-items: center;
`;
const App: React.FunctionComponent = () => {
  const { audioManager } = useContext(AudioManagerContext);
  const { channels } = useContext(ChannelManagerContext);
  const [on, setOn] = useState(false);
  const [bars, toggleBars] = useToggle(false);

  return (
    <Grid className="App">
      {!on && (
        <TurnOnButton
          onClick={() => {
            audioManager.init();
            setOn(true);
          }}
        >
          Turn On
        </TurnOnButton>
      )}

      <VoicePanel />
      <RecordingPanel />
      <AnalyserPanel />

      {on &&
        Object.keys(channels).map((channelNumber) => {
          const channelId = parseInt(channelNumber, 10) as ChannelId;
          return (
            <Channel key={channelId} channelId={channelId}>
              <ChannelBoard channelId={channelId} />
            </Channel>
          );
        })}
    </Grid>
  );
};

export default App;
