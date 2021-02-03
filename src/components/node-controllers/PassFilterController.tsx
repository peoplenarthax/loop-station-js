import React, {
  ChangeEvent,
  ReactEventHandler,
  SyntheticEvent,
  useCallback,
} from 'react';
import { Label, Name, Range } from './components';

export const LowPassController = ({
  onChangeQ,
  onChangeFreq,
}: {
  onChangeQ: (value: number) => void;
  onChangeFreq: (value: number) => void;
}) => {
  const onChangeInputQ = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeQ(parseInt(event.currentTarget.value, 10));
  };
  const onChangeInputFreq = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFreq(parseInt(event.currentTarget.value, 10));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Label>Q:</Label>
      <Range type="range" min="-20" max="100" onChange={onChangeInputQ} />
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
