import React, { useEffect } from 'react';
import TimeAgo from 'timeago-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import '../../assets/styles/tailwind.css';
import './Projects.scss';

import { IProject } from '../../types';
import { getProjects, setLocalStorageData, getLocalStorageData } from '../../services';
import Preloader from '../Preloader';

interface IProps extends RouteComponentProps<any> { }

const ProjectsComponent: React.FC<IProps> = ({ history }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [projects, setProjects] = React.useState<IProject[]>([]);

  const getGitLabProjects = () => {
    getLocalStorageData(['bookmarkProjectIds'])
      .then((data: any) => {
        getProjects()
          .then((response: IProject[]) => {
            const projectsList = response.map(project => {
              const projectExist = data.bookmarkProjectIds?.find((projectId: string) => projectId === project.id);
              project.bookmarkInd = !!projectExist;
              return project;
            })
            setProjects(projectsList)
          })
          .finally(() => setIsLoading(false));
      });
  }

  const toggleBookmarkProject = (projectId: string, bookmarkInd: boolean) => {
    let bookmarkProjectIds: string[] = [];
    const updatedProjects = projects.map((project: IProject) => {
      if (project.id === projectId) {
        project.bookmarkInd = bookmarkInd;
      }
      if (project.bookmarkInd) {
        bookmarkProjectIds.push(project.id);
      }
      return project;
    })
    setProjects(updatedProjects);
    setLocalStorageData('bookmarkProjectIds', bookmarkProjectIds);
  }

  useEffect(() => getGitLabProjects(), []);

  const ProjectItem: React.FC<{ project: IProject }> = ({ project }) => {
    return (
      <li className="flex justify-between items-center p-2 mb-1 rounded-md hover:bg-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 p-1 mr-2 text-center text-base rounded-md bg-blue-300">{project.name.substring(0, 1).toUpperCase()}</div>
          <div>
            <a href={project.webUrl} target="_blank">
              <span>{project.group.name} / </span>
              <span className="font-bold">{project.name}</span>
            </a>
            <div>
              <TimeAgo datetime={project.lastActivityAt} />
            </div>
          </div>
        </div>
        <div>
          <i className={`cursor-pointer ${project.bookmarkInd ? 'icon-star' : 'icon-star-o'}`} onClick={() => toggleBookmarkProject(project.id, !project.bookmarkInd)}></i>
        </div>
      </li>
    )
  }

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



export default withRouter(ProjectsComponent);
