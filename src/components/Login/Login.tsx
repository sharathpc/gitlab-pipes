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
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoginLoading, setIsLoginLoading] = React.useState(false);

  const getToken = () => {
    chrome.runtime.sendMessage({ action: 'token' }, (res: IMessage) => {
      setIsLoading(false);
      if (res.status) {
        updateRequestDetails(res.baseUrl, res.token);
        history.push('/dashboard');
      }
    });
  }

  const triggerLogin = () => {
    setIsLoginLoading(true);
    chrome.runtime.sendMessage({ action: 'login' }, (res: IMessage) => {
      setIsLoginLoading(false);
      if (res.status) {
        updateRequestDetails(res.baseUrl, res.token);
        history.push('/dashboard');
      }
    });
  }

  useEffect(() => getToken(), []);

  const LoginButton: React.FC = () => (
    <button
      className="text-base rounded bg-blue-600 text-white px-4 py-2 flex flex-row justify-center gap-3 items-center hover:bg-blue-700 duration-100 ease-in-out"
      onClick={triggerLogin}
    >
      {
        isLoginLoading ?
          <Preloader /> :
          <>
            <img src={gitlabLogo} alt="gitlab-icon" className="w-6 h-6" />
            Sign with GitLab
          </>
      }
    </button>
  )

  return (
    <div className="login-section">
      <img src={gitlabLogo} className="h-20 m-6" alt="logo" />
      {isLoading ? <Preloader /> : <LoginButton />}
    </div>
  );
};

export default withRouter(LoginComponent);
