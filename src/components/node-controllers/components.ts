import styled from 'styled-components';

export const Select = styled.select`
  font-weight: bold;
  color: #9a9a9a;
  border: none;
  border-radius: 4px;
  padding: 6px 16px;
  margin-right: 10px;
  background: #fafafa;
  box-shadow: inset 3px 3px 6px #d5d5d5, inset -3px -3px 6px #ffffff;
  appearance: none;
`;

export const Name = styled.h3`
  margin: 0 16px 0 0;
  font-size: 17px;
  background-color: #565656;
  color: transparent;
  text-shadow: 2px 2px 4px rgb(255 255 255 / 50%);
  -webkit-background-clip: text;
  text-transform: capitalize;
`;

export const Label = styled.label`
  color: #cacaca;
  margin-bottom: 2px;
`;

export const Range = styled.input`
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
