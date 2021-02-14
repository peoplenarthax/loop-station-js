import * as React from 'react';
import { useToggle } from '../../hooks/use-toggle';
import { CircularButton, RecIcon } from './styles';

type RecButtonProps = {
  onClick: () => void;
  isRecording: boolean;
};
export const ToggleRecButton: React.FC<RecButtonProps> = ({
  onClick,
  isRecording,
}) => {
  return (
    <CircularButton isRecording={isRecording} onClick={onClick}>
      <RecIcon isRecording={isRecording} />
    </CircularButton>
  );
};
