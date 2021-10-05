import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Dashboard from '../../components/Dashboard';
import Pipeline from '../../components/Pipeline';
import Projects from '../../components/Projects';
import Login from '../../components/Login';

const Popup: React.FC = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path='/dashboard' component={Dashboard} />
          <Route exact path='/dashboard/pipeline' component={Pipeline} />
          <Route exact path='/projects' component={Projects} />
          <Route path='/' component={Login} />
        </Switch>
      </Router>
      <div className="py-2 text-center">
        <span className="font-semibold">GitLab Pipes</span>
        <span className="mx-1">made with</span>
        <i className="icon-heart text-red-600 align-middle"></i>
      </div>
    </>
  );
};

export default Popup;

