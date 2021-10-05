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
      <li className="flex justify-between items-center py-2 px-3 mb-1 rounded-md hover:bg-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 p-1 mr-2 text-center text-base rounded-md bg-blue-300">{project.name.substring(0, 1).toUpperCase()}</div>
          <div>
            <a href={project.webUrl} target="_blank" className="font-bold">{project.name}</a>
            <div className="flex items-center">
              <img src={project.group.avatarUrl} alt={project.group.name} className="w-4 h-4 rounded-full" />
              <span className="ml-1">{project.group.name}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center w-44">
          <TimeAgo datetime={project.lastActivityAt} />
          <i className={`cursor-pointer ${project.bookmarkInd ? 'icon-bookmark' : 'icon-bookmark-o'}`} onClick={() => toggleBookmarkProject(project.id, !project.bookmarkInd)}></i>
        </div>
      </li>
    )
  }

  return (
    <div className="h-full projects-section">
      <div className="flex items-center mb-2">
        <i className="icon-arrow-circle-left cursor-pointer py-1 px-4" onClick={() => history.goBack()}></i>
        <div className="text-lg font-semibold">Projects List</div>
      </div>
      {
        isLoading ?
          <div className="flex justify-center items-center h-full">
            <Preloader />
          </div> :
          <ul className="max-h-full overflow-y-visible">
            {projects.map((project: IProject) => <ProjectItem key={project.id} project={project} />)}
          </ul>
      }
    </div>
  );
};



export default withRouter(ProjectsComponent);
