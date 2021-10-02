import React, { FC } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import Login from '../../components/Login';
import Dashboard from '../../components/Dashboard';
import './Popup.scss';

const history = createMemoryHistory();
const Popup: FC = () => {
  chrome.runtime.sendMessage({ action: 'login' }, (res) => {
    if (res.status) {
      console.log(res.token);
    } else {
      console.log('error');
    };
  });

  return (
    <Router history={history}>
      <div className="app">
        <Switch>
          <Route path='/' component={Login} />
          <Route path='/dashboard' component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
};

export default Popup;

