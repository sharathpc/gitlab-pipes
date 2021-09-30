import React, { FC } from 'react';
import Login from '../../components/Login/Login';
import './Popup.scss';

const Popup: FC = () => {
  chrome.runtime.sendMessage({ action: 'login' }, (res) => {
    if (res.status) {
      console.log(res.token);
    } else {
      console.log('error');
    };
  });

  return (
    <div className="app">
      <Login />
    </div>
  );
};

export default Popup;

