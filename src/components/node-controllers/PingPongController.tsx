import React, {
  ChangeEvent,
  ReactEventHandler,
  SyntheticEvent,
  useCallback,
} from 'react';
import { Label, Name, Range } from './components';

export const PingPongController = ({
  onChangeDelay,
}: {
  onChangeDelay: (value: number) => void;
}) => {
  const onChangeInputDelay = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeDelay(parseFloat(event.currentTarget.value));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Label>Delay:</Label>
      <Range
        type="range"
        min="0.01"
        max="3"
        step="0.01"
        onChange={onChangeInputDelay}
      />
    </div>
  );
};
