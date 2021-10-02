import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './Popup.scss';

import Login from '../../components/Login';
import Dashboard from '../../components/Dashboard';

const Popup: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path='/dashboard' component={Dashboard} />
          <Route path='/' component={Login} />
        </Switch>
      </div>
    </Router>
  );
};

export default Popup;

