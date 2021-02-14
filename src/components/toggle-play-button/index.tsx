import * as React from 'react';
import type { ChannelId } from '../../managers/AudioManager';
import { useAudioPercentage } from '../../hooks/use-audio-percentage';
import { CircularButton } from './styles';

type PlayButtonProps = {
  onClick: () => void;
  isPlaying: boolean;
  channelId: ChannelId;
};
export const TogglePlayButton: React.FC<PlayButtonProps> = ({
  onClick,
  isPlaying,
  channelId,
}) => {
  const percentage = useAudioPercentage(channelId, isPlaying);
  const circlePerimeter = 19 * 2 * Math.PI;
  const strokeDashoffset = circlePerimeter - percentage * circlePerimeter;

  return (
    <div style={{ position: 'relative' }}>
      <CircularButton isPlaying={isPlaying} onClick={onClick}>
        {!isPlaying ? 'PLAY' : 'STOP'}
      </CircularButton>
      <svg
        style={{
          position: 'absolute',
          left: '3px',
          top: '3px',
          pointerEvents: 'none',
        }}
        height={38}
        width={38}
      >
        <circle
          stroke="red"
          fill="transparent"
          strokeWidth={2}
          style={{ strokeDashoffset }}
          strokeDasharray={`${circlePerimeter} ${circlePerimeter}`}
          r={'19'}
          cx={'19'}
          cy={'19'}
        />
      </svg>
    </div>
  );
};
