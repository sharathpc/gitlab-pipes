import React, { FC } from 'react';
import logo from '../../assets/img/logo.svg';
import './Login.scss';

const LoginComponent: FC = () => {
  return (
    <div className="login-section">
      <img src={logo} className="app-logo" alt="logo" />
      {/* <p>
          Edit <code>src/pages/Popup/Popup.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a> */}
    </div>
  );
};

export default LoginComponent;
