import React from 'react';
import '../../assets/styles/tailwind.css';
import './PipelineStatus.scss';

import { IPipeline } from '../../types';
import gitlabLogo from '../../assets/img/icons.svg';
import { GLOBAL_BASE_URL } from '../../services';

interface IProps {
  pipeline: IPipeline
}

const PipelineStatus: React.FC<IProps> = ({ pipeline }) => {
  return (
    <div className="pipeline-status-section">
      <a href={`${GLOBAL_BASE_URL}${pipeline.path}`} target="_blank" className={`ci-status ci-${pipeline.status.toLowerCase()} qa-status-badge`}>
        <span className={`ci-status-icon ci-status-icon-${pipeline.status.toLowerCase()} js-ci-status-icon-${pipeline.status.toLowerCase()}`}>
          <svg className="inline align-middle">
            <use href={`${gitlabLogo}\#${pipeline.detailedStatus.icon}`}></use>
          </svg>
        </span>
        <span className="ml-1">{pipeline.detailedStatus.label}</span>
      </a>
    </div>
  );
};

export default PipelineStatus;
