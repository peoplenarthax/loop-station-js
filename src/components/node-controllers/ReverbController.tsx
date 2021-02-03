import React, { ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';
import { Select } from './components';

const BoardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  padding: 8px;
  border-radius: 7px;
  background: #fafafa;
  box-shadow: 8px 8px 16px #d5d5d5, -8px -8px 16px #ffffff;
  margin-bottom: 30px;
`;

const REVERB_OPTIONS = ['chamber', 'slinky'];

export const ReverbController = ({
  onChange,
}: {
  onChange: (reverb: string) => void;
}) => {
  const onChangeReverb = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.currentTarget.value);
  };

  return (
    <BoardContainer>
      <Select onChange={onChangeReverb}>
        {REVERB_OPTIONS.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </Select>
    </BoardContainer>
  );
};
