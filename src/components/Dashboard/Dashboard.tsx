import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import '../../assets/styles/tailwind.css';
import './Dashboard.scss';

import { IProject } from '../../types';
import { getLocalStorageData, getPipeLines } from '../../services';
import gitlabLogo from '../../assets/img/logo.svg';
import Preloader from '../Preloader';
import PipelineStatus from '../PipelineStatus';
import Pipeline from '../Pipeline';

interface IProps extends RouteComponentProps<any> { }

const DashboardComponent: React.FC<IProps> = ({ history }: IProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [bookmarkProjects, setBookmarkProjects] = React.useState<IProject[]>([]);

  const getBookmarkProjects = (loading: boolean = false) => {
    setIsLoading(loading);
    getLocalStorageData(['bookmarkProjectIds'])
      .then((data: any) => {
        if (data.bookmarkProjectIds) {
          getPipeLines(data.bookmarkProjectIds)
            .then(response => {
              const projectsList = response.map((project: IProject) => {
                const bookmarkProject = bookmarkProjects.find((bookmarkProject: IProject) => bookmarkProject.id === project.id);
                project.isExpanded = bookmarkProject?.isExpanded || false;
                return project;
              })
              setBookmarkProjects(projectsList);
            })
            .finally(() => {
              setTimeout(() => getBookmarkProjects(), 10000);
              setIsLoading(false);
            })
        } else {
          setIsLoading(false);
        }
      })
  }

  const toggleShowProject = (project: IProject) => {
    const projectsList = bookmarkProjects.map((bProject: IProject) => {
      if (bProject.id === project.id) {
        bProject.isExpanded = !project.isExpanded;
      } else {
        bProject.isExpanded = false;
      }
      return bProject;
    })
    setBookmarkProjects(projectsList);
  }

  const openOptions = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('/options.html')
    });
  }

  useEffect(() => getBookmarkProjects(true), []);


  const ProjectItem: React.FC<{ project: IProject }> = ({ project }) => {
    return (
      <li className={`py-2 px-3 mb-1 rounded-md ${project.isExpanded ? 'shadow-md bg-gray-800' : 'hover:bg-gray-700'}`}>
        <div className="overflow-hidden">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleShowProject(project)}>
            <div className="flex items-center">
              <div className="w-8 h-8 p-1 mr-2 text-center text-base rounded-md bg-blue-300 text-white">{project.name.substring(0, 1).toUpperCase()}</div>
              <div>
                <a href={project.webUrl} target="_blank" className="text-gray-200 font-bold">{project.name}</a>
                <div className="flex items-center">
                  <img src={project.group.avatarUrl} alt={project.group.name} className="w-4 h-4 rounded-full" />
                  <span>{project.group.name}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center w-28">
              {project.pipelines.length && <PipelineStatus pipeline={project.pipelines[0]} />}
              <i className={`p-1 ${project.isExpanded ? 'icon-chevron-up' : 'icon-chevron-down'}`}></i>
            </div>
          </div>
          <div className={project.isExpanded ? 'block' : 'hidden'}>
            <table className="mt-2 w-full border-separate border-spacing-5">
              <thead>
                <tr>
                  <th className="w-20 text-gray-200">Status</th>
                  <th className="w-20 text-gray-200 text-center">Triggerer</th>
                  <th className="text-gray-200">Stages</th>
                  <th className="w-28 text-gray-200">Duration</th>
                </tr>
              </thead>
              <tbody>
                {project.pipelines.map(pipeline => <Pipeline key={pipeline.id} pipeline={pipeline} />)}
              </tbody>
            </table>
          </div>
        </div>
      </li>
    )
  }

  return (
    <div className="h-full dashboard-section">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <img src={gitlabLogo} className="h-6 mx-3" alt="logo" />
          <div className="text-lg font-semibold">Dashboard</div>
        </div>
        {!!bookmarkProjects.length && <div>
          <i className="icon-folder cursor-pointer py-1 px-2" title="Projects" onClick={() => history.push('projects')}></i>
          <i className="icon-cog cursor-pointer py-1 pr-8 pl-2" title="Options" onClick={() => openOptions()}></i>
        </div>}
      </div>
      {
        isLoading ?
          <div className="flex justify-center items-center h-full">
            <Preloader />
          </div> : (
            bookmarkProjects.length ?
              <ul className="content-footer-height overflow-y-scroll">
                {bookmarkProjects.map((project: IProject) => <ProjectItem key={project.id} project={project} />)}
              </ul> :
              <div className="flex flex-col justify-center items-center h-full">
                <div className="mb-3">No Projects selected</div>
                <button className="text-xs rounded bg-blue-400 text-white px-2 py-1 hover:bg-blue-500 duration-100 ease-in-out" onClick={() => history.push('projects')}>Select Projects</button>
              </div>
          )
      }
    </div>
  );
};

export default withRouter(DashboardComponent);
