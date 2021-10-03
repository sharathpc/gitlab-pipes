import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { getProjects } from '../../services';
import '../../assets/styles/tailwind.css';
import './Dashboard.scss';

interface IProps extends RouteComponentProps<any> { }

const DashboardComponent: React.FC<IProps> = ({ history }: IProps) => {
  /* const getGitLabProjects = () => {
    getProjects()
      .then(response => {
        console.log(response.data)
      });
  } */

  //useEffect(() => getGitLabProjects(), []);

  return (
    <div className="h-full dashboard-section">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold ml-4">Dashboard</div>
        <i className="icon-star cursor-pointer py-1 px-4" onClick={() => history.push('projects')}></i>
      </div>
    </div>
  );
};

export default withRouter(DashboardComponent);
