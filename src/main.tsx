import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@radix-ui/themes/styles.css';

import { ThemeProvider } from './ThemeProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider accentColor="blue" grayColor="gray" scaling="100%" radius="medium" appearance="light">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
