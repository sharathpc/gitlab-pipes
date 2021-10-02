import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { message } from '../../types';
import '../../assets/styles/tailwind.css';
import './Login.scss';

import gitlabLogo from '../../assets/img/logo.svg';
import Preloader from '../Preloader';

interface IProps extends RouteComponentProps<any> { }

const LoginComponent: React.FC<IProps> = ({ history }: IProps) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoginLoading, setIsLoginLoading] = React.useState(false);

  useEffect(() => {
    const getToken = () => {
      chrome.runtime.sendMessage({ action: 'token' }, (res: message) => {
        setIsLoading(false);
        if (res.status) history.push('/dashboard', { token: res.token });
      });
    }
    getToken();
  }, []);

  const triggerLogin = () => {
    setIsLoginLoading(true);
    chrome.runtime.sendMessage({ action: 'login' }, (res: message) => {
      setIsLoginLoading(false);
      if (res.status) history.push('/dashboard', { token: res.token });
    });
  }

  const LoginButton: React.FC = () => (
    <button
      className="text-base rounded bg-blue-600 text-white px-4 py-2 flex flex-row justify-center gap-3 items-center hover:bg-blue-700 duration-100 ease-in-out"
      onClick={triggerLogin}
    >
      {isLoginLoading ? <Preloader /> : <React.Fragment>
        <img src={gitlabLogo} alt="gitlab-icon" className="w-6 h-6" />
        Sign with GitLab
      </React.Fragment>}
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
