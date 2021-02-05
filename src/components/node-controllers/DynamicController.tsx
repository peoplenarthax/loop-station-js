import React from 'react';
import { Name, Range, Label } from './components';

type ISpecs = {
  [k: string]: {
    displayName: string;
    min: number;
    max: number;
    defaultValue: number;
    step?: number;
    changeFunction: (value: number) => void;
  };
};
export const DynamicController = ({ specs }: { specs: ISpecs }) => {
  const onChangeInput = (changeFunction: (value: number) => void) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    changeFunction(parseFloat(event.currentTarget.value));
  };

  const keys = Object.keys(specs);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {Object.keys(specs).map((key) => {
        const { displayName, changeFunction, ...props } = specs[key];
        return (
          <>
            <Label key={key} htmlFor={key}>
              {displayName}
            </Label>
            <Range
              key={key}
              type="range"
              onChange={onChangeInput(changeFunction)}
              {...props}
            />
          </>
        );
      })}
    </div>
  );
};
