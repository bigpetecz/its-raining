import { inspect } from '@xstate/inspect';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';

inspect({
  // options
  // url: 'https://stately.ai/viz?inspect', // (default)
  iframe: false // open in new window
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
