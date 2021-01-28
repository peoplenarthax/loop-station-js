import styled, { keyframes, css } from 'styled-components';

const blink = keyframes`
	from {
		text-shadow: 1px 1px #ffffff4d, -1px -1px 2px #505050e8,
    0 0 9px var(--color-button);
	}

	to {
		text-shadow: 1px 1px #ffffff4d, -1px -1px 2px #505050e8,
    0 0 0 var(--color-button);
	}
`;

const blinkStyle = css`
  animation: ${blink} 1s linear infinite;
`;

export const CircularButton = styled.button<{ isPlaying: boolean }>`
  --color-button: ${({ isPlaying }) => (isPlaying ? '#ff4920b0' : '#24c8ffb0')};
  width: 120px;
  height: 120px;
  border: none;
  border-radius: 50%;
  background: #fffafa;
  box-shadow: 16px 16px 27px #cfcbcb, -16px -16px 27px #ffffff;
  font-size: 20px;
  outline: none;
  /* Text style */
  text-shadow: 1px 1px #ffffff4d, -1px -1px 2px #505050e8,
    0 0 9px var(--color-button);
  color: var(--color-button);
  transition: all 250ms ease-in-out;
  ${({ isPlaying }) => (isPlaying ? blinkStyle : '')}

  &:hover {
    box-shadow: 10px 10px 20px #cfcbcb, -10px -10px 20px #ffffff;
  }

  &:active {
    box-shadow: 6px 6px 12px #cfcbcb, -6px -6px 12px #ffffff;
  }
`;
