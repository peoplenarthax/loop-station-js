import styled, { keyframes, css } from 'styled-components';

export const RecIcon = styled.div<{ isRecording: boolean }>`
  width: 12px;
  height: 12px;
  background-color: #f37070d6;

  border-radius: ${({ isRecording }) => (isRecording ? '0%' : '50%')};

  transition: border-radius 300ms ease-in;
`;

const clicked = css`
  box-shadow: inset 5px 5px 10px #ccc8c8, inset -5px -5px 10px #ffffff;
`;

export const CircularButton = styled.button<{ isRecording: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: #fffafa;
  box-shadow: 7px 7px 14px #ccc8c8, -7px -7px 14px #ffffff;
  outline: none;
  transition: all 250ms ease-in-out;

  &:hover {
    box-shadow: 3px 3px 8px #ccc8c8, -3px -3px 8px #ffffff;
  }
  ${({ isRecording }) => isRecording && clicked}
`;
