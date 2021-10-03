import React, { useEffect } from 'react';
import TimeAgo from 'timeago-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import '../../assets/styles/tailwind.css';
import './Projects.scss';

import { IProject } from '../../types';
import { getProjects } from '../../services';
import Preloader from '../Preloader';

interface IProps extends RouteComponentProps<any> { }

const ProjectsComponent: React.FC<IProps> = ({ history }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [projects, setProjects] = React.useState([]);

  const getGitLabProjects = () => {
    getProjects()
      .then(response => setProjects(response.data))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => getGitLabProjects(), []);

  return (
    <div className="h-full projects-section">
      <div className="flex items-center">
        <i className="icon-arrow-circle-left cursor-pointer py-1 px-4" onClick={() => history.goBack()}></i>
        <div className="text-lg font-semibold">Projects List</div>
      </div>
      {
        isLoading ?
          <div className="flex justify-center items-center h-full">
            <Preloader />
          </div> :
          <ul className="max-h-full overflow-y-auto">
            {projects.map((project: IProject) => <ProjectItem key={project.id} project={project} />)}
          </ul>
      }
    </div>
  );
};

const ProjectItem: React.FC<{ project: IProject }> = ({ project }) => {
  return (
    <li className="flex justify-between items-center p-2 mb-1 rounded-md hover:bg-gray-700">
      <div className="flex items-center">
        <div className="w-8 h-8 p-1 mr-2 text-center text-base rounded-md bg-blue-300">{project.name.substring(0, 1).toUpperCase()}</div>
        <div>
          <a href={project.web_url} target="_blank">
            <span>{project.namespace.name} / </span>
            <span className="font-bold">{project.name}</span>
          </a>
          <div>
            <TimeAgo datetime={project.last_activity_at} />
          </div>
        </div>
      </div>
      <div>

      </div>
    </li>
  )
}

export default withRouter(ProjectsComponent);
