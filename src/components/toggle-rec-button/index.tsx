import * as React from 'react';
import { useToggle } from '../../hooks/use-toggle';
import { CircularButton, RecIcon } from './styles';

type RecButtonProps = {
  onRec: () => void;
  onStop: () => void;
};
export const ToggleRecButton: React.FC<RecButtonProps> = ({
  onRec,
  onStop,
}) => {
  const [isRecording, toggle] = useToggle(false);

  const onToggle = React.useCallback(() => {
    isRecording ? onStop() : onRec();

    toggle();
  }, [isRecording]);

  return (
    <CircularButton isRecording={isRecording} onClick={onToggle}>
      <RecIcon isRecording={isRecording} />
    </CircularButton>
  );
};
