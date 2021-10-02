import React from 'react';
import { render } from 'react-dom';
import './index.scss';

import Options from './Options';

render(
  <Options title={'settings'} />,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
