import React, { useRef, useEffect, Component } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  max-width: 260px;
  border-radius: 15px;
  padding: 15px;
  grid-column: span 2;
  background: linear-gradient(145deg, #e6e1e1, #ffffff);
  box-shadow: 12px 12px 24px #d9d5d5, -12px -12px 24px #ffffff;
`;

export const AudioVisualiser = ({
  audioData,
  bars,
}: {
  audioData: Uint8Array;
  bars: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current!;
    const height = canvas.height;
    const width = canvas.width;
    const context = canvas.getContext('2d')!;
    let x = 0;
    const sliceWidth = (width * 1.0) / audioData.length;

    context.lineWidth = 2;
    context.strokeStyle = '#24c8ffb0';
    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(0, height / 2);
    for (const item of audioData) {
      const y = (item / 255.0) * height;
      context.lineTo(x, y);
      x += sliceWidth;
    }
    context.lineTo(x, height / 2);
    context.stroke();
  };

  const drawBars = function () {
    const canvas = canvasRef.current!;
    const height = canvas.height;
    const width = canvas.width;
    const context = canvas.getContext('2d')!;

    context.clearRect(0, 0, width, height);

    const barWidth = (width / audioData.length) * 2.5;
    let x = 0;

    for (const item of audioData) {
      context.fillStyle = `#24c8ff${item.toString(16)}`;
      context.fillRect(x, height - item / 2, barWidth, item / 2);

      x += barWidth + 1;
    }
  };

  useEffect(() => {
    bars ? drawBars() : draw();
  });

  return <Canvas height="150" ref={canvasRef} />;
};
