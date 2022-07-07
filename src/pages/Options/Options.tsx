import React, { useEffect } from 'react';
import { IMessage } from '../../types';
import '../../assets/styles/tailwind.css';
import './Options.scss';

import gitlabLogo from '../../assets/img/logo.svg';
import Preloader from '../../components/Preloader';
import Footer from '../../components/Footer';

const Options: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoginLoading, setIsLoginLoading] = React.useState(false);
  const [baseURL, setBaseURL] = React.useState<string>('');
  const [token, setToken] = React.useState<string>('');

  const getOptions = () => {
    chrome.runtime.sendMessage({ action: 'token' }, (res: IMessage) => {
      setIsLoading(false);
      if (res.status) {
        setBaseURL(res.baseURL);
        setToken(res.token);
      }
    });
  }

  const triggerUpdateToken = () => {
    setIsLoginLoading(true);
    chrome.runtime.sendMessage({
      action: 'login',
      baseURL: baseURL,
      token: token,
    }, (res: IMessage) => {
      setIsLoginLoading(false);
    });
  }

  function handleBaseUrlChange(event: any) {
    setBaseURL(event.target.value);
  }

  function handleTokenChange(event: any) {
    setToken(event.target.value);
  }

  useEffect(() => getOptions(), []);

  return (
    <>
      <div className="login-section">
        <img src={gitlabLogo} className="h-20 m-6" alt="logo" />
        {isLoading ? <Preloader /> : <>
          <input
            key="url"
            type="url"
            className='mb-4 rounded border-2 px-2 text-black'
            placeholder='GitLab Base URL'
            value={baseURL}
            onChange={handleBaseUrlChange}
            disabled={isLoginLoading}
          />
          <input
            key="password"
            type="password"
            className='mb-4 rounded border-2 px-2 text-black'
            placeholder='GitLab Token'
            value={token}
            onChange={handleTokenChange}
            disabled={isLoginLoading}
          />
          <button
            className="text-base rounded bg-blue-600 text-white px-4 py-2 flex flex-row justify-center gap-3 items-center hover:bg-blue-700 duration-100 ease-in-out disabled:opacity-75"
            onClick={triggerUpdateToken}
            disabled={baseURL === '' || token === ''}
          >
            {
              isLoginLoading ?
                <Preloader /> :
                <>
                  <img src={gitlabLogo} alt="gitlab-icon" className="w-6 h-6" />
                  Set GitLab Credentials
                </>
            }
          </button>
        </>}
      </div>
      <Footer />
    </>
  );
};

export default Options;
