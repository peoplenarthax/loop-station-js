import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Analyser } from './components/analyser';
import { ChannelBoard } from './components/channel-board/ChannelBoard';
import { ToggleRecButton } from './components/toggle-rec-button';
import { useToggle } from './hooks/use-toggle';
import type { ChannelId } from './managers/AudioManager';
import { AudioManagerContext } from './providers/audio';

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
const App: React.FunctionComponent = ({}) => {
  const { audioManager } = useContext(AudioManagerContext);
  const [analyserView, setAnalyserView] = useState(false);
  const [bars, toggleBars] = useToggle(false);

  return (
    <Grid className="App">
      <Button onClick={() => setAnalyserView(true)}>Analyser</Button>
      <Button onClick={toggleBars}>Toggle Visual</Button>
      {analyserView && <Analyser bars={bars} />}

      {([1, 2, 3, 4, 5] as ChannelId[]).map((channelNumber) => (
        <Channel channelId={channelNumber}>
          <ToggleRecButton
            onRec={() => audioManager.record(channelNumber)}
            onStop={audioManager.stopRecording}
          />

          <ChannelBoard channel={channelNumber} />
        </Channel>
      ))}
    </Grid>
  );
};

export default App;
