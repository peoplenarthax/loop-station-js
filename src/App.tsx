import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Analyser } from './components/analyser';
import { ChannelBoard } from './components/channel-board/ChannelBoard';
import { SpeedController } from './components/node-controllers/SpeedController';
import { ToggleRecButton } from './components/toggle-rec-button';
import { useToggle } from './hooks/use-toggle';
import type { ChannelId } from './managers/AudioManager';
import { AudioManagerContext } from './providers/audio';
import type { IChannelManagerContext } from './providers/channel';

const Button = styled.button`
  color: #f37070d6;
  max-height: 34px;
  max-width: 135px;
  border: none;
  border-radius: 11px;
  background: #fffafa;
  box-shadow: 9px 9px 17px #d9d5d5, -9px -9px 17px #ffffff;
`;

const Grid = styled.main`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 220px 1fr;
  grid-template-areas:
    'general general general general general'
    'channel1 channel2 channel3 channel4 channel5';
  grid-row-gap: 20px;
  max-width: 950px;
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
const App: React.FunctionComponent<{
  channels: IChannelManagerContext['channels'];
}> = ({ channels }) => {
  const { audioManager } = useContext(AudioManagerContext);
  const [analyserView, setAnalyserView] = useState(false);
  const [on, setOn] = useState(false);
  const [bars, toggleBars] = useToggle(false);

  return (
    <Grid className="App">
      {!on && (
        <Button
          onClick={() => {
            audioManager.init();
            setOn(true);
          }}
        >
          Turn On
        </Button>
      )}
      <Button onClick={() => setAnalyserView(true)}>Analyser</Button>
      <Button onClick={toggleBars}>Toggle Visual</Button>

      {analyserView && <Analyser bars={bars} channels={channels} />}

      {on &&
        Object.keys(channels).map((channelNumber) => {
          const channelId = parseInt(channelNumber, 10) as ChannelId;
          return (
            <Channel key={channelId} channelId={channelId}>
              <ToggleRecButton
                onRec={() => audioManager.record(channelId)}
                onStop={audioManager.stopRecording}
              />
              <SpeedController
                onChangeSpeed={audioManager.changeSpeed(channelId)}
              />
              <ChannelBoard channelId={channelId} />
            </Channel>
          );
        })}
    </Grid>
  );
};

export default App;
