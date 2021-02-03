import React, {
  ChangeEvent,
  ReactEventHandler,
  SyntheticEvent,
  useCallback,
} from 'react';
import { Label, Name, Range } from './components';

export const RingModulatorController = ({
  onChangeDistortion,
  onChangeSpeed,
}: {
  onChangeDistortion: (value: number) => void;
  onChangeSpeed: (value: number) => void;
}) => {
  const onChangeInputSpeed = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeSpeed(parseInt(event.currentTarget.value, 10));
  };
  const onChangeInputDistortion = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onChangeDistortion(parseFloat(event.currentTarget.value));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Label>Speed:</Label>
      <Range
        type="range"
        min="0"
        max="3000"
        defaultValue="20"
        step="20"
        onChange={onChangeInputSpeed}
      />

      <Label>Distortion:</Label>
      <Range
        type="range"
        min="0.5"
        max="50"
        defaultValue="1"
        step="0.5"
        onChange={onChangeInputDistortion}
      />
    </div>
  );
};
