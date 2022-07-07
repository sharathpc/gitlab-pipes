import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IMessage } from '../../types';
import '../../assets/styles/tailwind.css';
import './Login.scss';

import { updateRequestDetails } from '../../services';
import gitlabLogo from '../../assets/img/logo.svg';
import Preloader from '../Preloader';

interface IProps extends RouteComponentProps<any> { }

const LoginComponent: React.FC<IProps> = ({ history }: IProps) => {
  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'token' }, (res: IMessage) => {
      if (res.status) {
        updateRequestDetails(res.baseURL, res.token);
        history.push('/dashboard');
      } else {
        chrome.tabs.create({
          url: chrome.runtime.getURL('/options.html')
        });
      }
    });
  }, []);

  return (
    <div className="login-section">
      <img src={gitlabLogo} className="h-20 m-6" alt="logo" />
      <Preloader />
    </div>
  );
};

export default withRouter(LoginComponent);
