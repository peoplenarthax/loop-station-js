import * as React from 'react';
import { useToggle } from '../../hooks/use-toggle';
import { CircularButton } from './styles';

type PlayButtonProps = {
  onPlay: () => void;
  onStop: () => void;
};
export const TogglePlayButton: React.FC<PlayButtonProps> = ({
  onPlay,
  onStop,
}) => {
  const [isPlaying, toggle] = useToggle(false);

  const onToggle = React.useCallback(() => {
    isPlaying ? onStop() : onPlay();

    toggle();
  }, [isPlaying]);

  return (
    <CircularButton isPlaying={isPlaying} onClick={onToggle}>
      {!isPlaying ? 'PLAY' : 'STOP'}
    </CircularButton>
  );
};
