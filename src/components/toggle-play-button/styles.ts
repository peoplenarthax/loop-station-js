import styled, { keyframes, css } from 'styled-components';
import { CommonCircularButton } from '../common';

export const CircularButton = styled(CommonCircularButton)<{
  isPlaying: boolean;
}>`
  --color-button: ${({ isPlaying }) => (isPlaying ? '#ff4920b0' : '#24c8ffb0')};

  color: var(--color-button);
  width: 44px;
  height: 44px;
`;
