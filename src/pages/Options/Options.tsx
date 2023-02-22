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
      } else {
        handleError(res.message);
      }
    });
  }

  const triggerUpdateToken = ($event: any) => {
    setIsLoginLoading(true);
    chrome.runtime.sendMessage({
      action: 'login',
      baseURL: baseURL.trim(),
      token: token.trim(),
    }, (res: IMessage) => {
      if (!res.status) {
        handleError(res.message);
      }
      setIsLoginLoading(false);
    });
    $event.preventDefault();
  }

  const handleError = (error: any) => {
    alert(error);
  }

  useEffect(() => getOptions(), []);

  return (
    <>
      <form className="login-section" onSubmit={triggerUpdateToken}>
        <img src={gitlabLogo} className="h-20 m-6" alt="logo" />
        <div className="text-xs text-center w-96 mb-5">Generate a personal access token with <code>read_api</code> scope from the User Settings - Access Tokens section in GitLab.</div>
        {isLoading ? <Preloader /> : <>
          <div className="flex flex-col w-72 mb-4">
            <label className="text-sm mb-2">GitLab Base URL</label>
            <input
              key="url"
              type="url"
              className="border rounded py-1.5 px-3 text-white focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
              placeholder='https://<your-gitlab-site.com>'
              value={baseURL}
              onChange={($event) => setBaseURL($event.target.value)}
              disabled={isLoginLoading}
              required
            />
          </div>
          <div className="flex flex-col w-72 mb-8">
            <label className="text-sm mb-2">GitLab Personal Access Token</label>
            <input
              key="password"
              type="password"
              className="border rounded py-1.5 px-3 text-white focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
              placeholder='glpat-xxxxxxxxxxxxxxxxxx'
              value={token}
              onChange={($event) => setToken($event.target.value)}
              disabled={isLoginLoading}
              required
            />
          </div>
          <button
            type="submit"
            className="text-base rounded bg-blue-600 text-white px-4 py-2 flex flex-row justify-center gap-3 items-center hover:bg-blue-700 duration-100 ease-in-out disabled:opacity-75"
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
      </form>
      <Footer />
    </>
  );
};

export default Options;
