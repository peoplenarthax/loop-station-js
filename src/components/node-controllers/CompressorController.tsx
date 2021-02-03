import React, {
  ChangeEvent,
  ReactEventHandler,
  SyntheticEvent,
  useCallback,
} from 'react';
import { Label, Name, Range } from './components';

export const CompressorController = ({
  onChangeKnee,
  onChangeThreshold,
  onChangeRatio,
  onChangeAttack,
}: {
  onChangeKnee: (value: number) => void;
  onChangeThreshold: (value: number) => void;
  onChangeRatio: (value: number) => void;
  onChangeAttack: (value: number) => void;
  onChangeGain: (value: number) => void;
}) => {
  const onChangeInputKnee = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeKnee(parseInt(event.currentTarget.value, 10));
  };
  const onChangeInputThreshold = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onChangeThreshold(parseFloat(event.currentTarget.value));
  };
  const onChangeInputRatio = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeRatio(parseFloat(event.currentTarget.value));
  };
  const onChangeInputAttack = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeAttack(parseFloat(event.currentTarget.value));
  };

  onChangeAttack;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Label>Knee:</Label>
      <Range
        type="range"
        min="0"
        max="40"
        defaultValue="40"
        step="1"
        onChange={onChangeInputKnee}
      />

      <Label>Threshold:</Label>
      <Range
        type="range"
        min="-100"
        max="0"
        defaultValue="-50"
        step="1"
        onChange={onChangeInputThreshold}
      />

      <Label>Ratio:</Label>
      <Range
        type="range"
        min="1"
        max="20"
        defaultValue="12"
        step="1"
        onChange={onChangeInputRatio}
      />

      <Label>Attack:</Label>
      <Range
        type="range"
        min="1"
        max="20"
        defaultValue="12"
        step="1"
        onChange={onChangeInputAttack}
      />
    </div>
  );
};
