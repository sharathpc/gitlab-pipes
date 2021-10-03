import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './Popup.scss';

import Dashboard from '../../components/Dashboard';
import Pipeline from '../../components/Pipeline';
import Projects from '../../components/Projects';
import Login from '../../components/Login';

const Popup: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path='/dashboard' component={Dashboard} />
          <Route exact path='/dashboard/pipeline' component={Pipeline} />
          <Route exact path='/projects' component={Projects} />
          <Route path='/' component={Login} />
        </Switch>
      </div>
    </Router>
  );
};

export default Popup;

