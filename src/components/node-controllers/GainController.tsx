import React, {
  ChangeEvent,
  ReactEventHandler,
  SyntheticEvent,
  useCallback,
} from 'react';
import { Name, Range } from './components';

export const GainController = ({
  onChangeGain,
}: {
  onChangeGain: (value: number) => void;
}) => {
  const onChangeInputGain = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeGain(parseFloat(event.currentTarget.value));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Range
        type="range"
        min="0"
        max="3"
        defaultValue="1"
        step="0.01"
        onChange={onChangeInputGain}
      />
    </div>
  );
};
