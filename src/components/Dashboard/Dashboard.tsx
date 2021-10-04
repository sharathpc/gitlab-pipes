import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import '../../assets/styles/tailwind.css';
import './Dashboard.scss';

import { IProject } from '../../types';
import { getLocalStorageData, getPipeLines } from '../../services';
import Preloader from '../Preloader';

interface IProps extends RouteComponentProps<any> { }

const DashboardComponent: React.FC<IProps> = ({ history }: IProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [bookmarkProjects, setBookmarkProjects] = React.useState<IProject[]>([]);

  const getBookmarkProjects = () => {
    getLocalStorageData(['bookmarkProjectIds'])
      .then((data: any) => {
        if (data.bookmarkProjectIds) {
          getPipeLines(data.bookmarkProjectIds)
            .then(response => setBookmarkProjects(response))
            .finally(() => setIsLoading(false))
        } else {
          history.push('projects');
        }
      })
  }

  useEffect(() => getBookmarkProjects(), []);

  const ProjectItem: React.FC<{ project: IProject }> = ({ project }) => {
    return (
      <li className="flex justify-between items-center p-2 mb-1 rounded-md hover:bg-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 p-1 mr-2 text-center text-base rounded-md bg-blue-300">{project.name.substring(0, 1).toUpperCase()}</div>
          <div>
            <span>{project.group.name} / </span>
            <span className="font-bold">{project.name}</span>
          </div>
        </div>
      </li>
    )
  }

  return (
    <div className="h-full dashboard-section">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold ml-4">Dashboard</div>
        <i className="icon-star cursor-pointer py-1 px-4" onClick={() => history.push('projects')}></i>
      </div>
      {
        isLoading ?
          <div className="flex justify-center items-center h-full">
            <Preloader />
          </div> :
          <ul className="max-h-full overflow-y-auto">
            {bookmarkProjects.map((project: IProject) => <ProjectItem key={project.id} project={project} />)}
          </ul>
      }
    </div>
  );
};

export default withRouter(DashboardComponent);
