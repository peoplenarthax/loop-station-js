import React, {
  ChangeEvent,
  ReactEventHandler,
  SyntheticEvent,
  useCallback,
} from 'react';
import { Name, Range } from './components';

export const SpeedController = ({
  onChangeSpeed,
}: {
  onChangeSpeed: (value: number) => void;
}) => {
  const onChangeInputSpeed = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeSpeed(parseFloat(event.currentTarget.value));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Range
        type="range"
        min="0"
        max="4"
        defaultValue="1"
        step="0.25"
        onChange={onChangeInputSpeed}
      />
    </div>
  );
};
