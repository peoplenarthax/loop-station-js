import React, {
  ChangeEvent,
  ReactEventHandler,
  SyntheticEvent,
  useCallback,
} from 'react';
import { Label, Name, Range } from './components';

export const ShelfFilterController = ({
  onChangeGain,
  onChangeFreq,
}: {
  onChangeGain: (value: number) => void;
  onChangeFreq: (value: number) => void;
}) => {
  const onChangeInputGain = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeGain(parseInt(event.currentTarget.value, 10));
  };
  const onChangeInputFreq = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFreq(parseInt(event.currentTarget.value, 10));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Label>Gain:</Label>
      <Range type="range" min="-20" max="100" onChange={onChangeInputGain} />
      <Label>Frequency:</Label>
      <Range
        type="range"
        step="100"
        min="20"
        max="20000"
        onChange={onChangeInputFreq}
      />
    </div>
  );
};
