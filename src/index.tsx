import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { AudioProvider } from './providers/audio';
import {
  ChannelManagerContext,
  ChannelProvider,
  IChannelManagerContext,
} from './providers/channel';

ReactDOM.render(
  <React.StrictMode>
    <ChannelProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </ChannelProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
