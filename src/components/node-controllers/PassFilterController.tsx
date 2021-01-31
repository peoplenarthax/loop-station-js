import React, {
  ChangeEvent,
  ReactEventHandler,
  SyntheticEvent,
  useCallback,
} from 'react';
import styled from 'styled-components';

const Name = styled.h3`
  margin: 0 0 4px;
  font-size: 17px;
  background-color: #565656;
  color: transparent;
  text-shadow: 2px 2px 4px rgb(255 255 255 / 50%);
  -webkit-background-clip: text;
`;
const Label = styled.label`
  color: #cacaca;
  margin-bottom: 2px;
`;
const Range = styled.input`
  -webkit-appearance: none;
  margin-bottom: 4px;

  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 16px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: inset 3px 3px 6px #c8d0d5, inset -3px -3px 6px #ffffff;
    background: #ebf5fa;
    border-radius: 5px;
  }
  &::-webkit-slider-thumb {
    box-shadow: 3px 3px 6px #d9d5d5, -3px -3px 6px #ffffff;
    height: 16px;
    width: 16px;
    border-radius: 22px;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -0.5px;
  }
`;
export const LowPassController = (filterName: string) => ({
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
      <Name>{filterName}</Name>
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
