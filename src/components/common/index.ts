import styled from 'styled-components';

export const Button = styled.button`
  color: #5b5b5b;
  font-weight: bold;
  max-width: 135px;
  padding: 16px;
  border: none;
  border-radius: 11px;
  background: #fffafa;
  box-shadow: 4px 4px 8px #d9d5d5, -4px -4px 8px #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CommonCircularButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 50%;
  background: #fffafa;
  box-shadow: 8px 8px 12px #cfcbcb, -16px -16px 27px #ffffff;
  font-size: 11px;
  outline: none;
  /* Text style */
  font-weight: bold;
  transition: all 250ms ease-in-out;

  &:hover {
    box-shadow: 10px 10px 20px #cfcbcb, -10px -10px 20px #ffffff;
  }

  &:active {
    box-shadow: 6px 6px 12px #cfcbcb, -6px -6px 12px #ffffff;
  }
`;
