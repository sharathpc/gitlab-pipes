import React from 'react';
import TimeAgo from 'timeago-react';
import '../../assets/styles/tailwind.css';
import './Pipeline.scss';

import { IPipeline } from '../../types';
import gitlabLogo from '../../assets/img/icons.svg';
import PipelineStatus from '../PipelineStatus';
import { GLOBAL_BASE_URL } from '../../services';

interface IProps {
  pipeline: IPipeline
}

const PipelineComponent: React.FC<IProps> = ({ pipeline }) => {
  const secondsToTime = (e: number) => {
    const h = Math.floor(e / 3600).toString().padStart(2, '0'),
      m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
      s = Math.floor(e % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  return (
    <tr className="pipeline-section">
      <td>
        <PipelineStatus pipeline={pipeline} />
      </td>
      <td>
        <img src={
          pipeline.user.avatarUrl.includes('gravatar') ?
            pipeline.user.avatarUrl :
            `${GLOBAL_BASE_URL}${pipeline.user.avatarUrl}`
        } alt={pipeline.user.name} title={pipeline.user.name} className="rounded-full w-6 h-6 block m-auto" />
      </td>
      <td className="stage-cell">
        <div className="gl-display-inline">
          {
            pipeline.stages.map(stage =>
              <a href={`${GLOBAL_BASE_URL}${stage.job?.detailedStatus?.detailsPath}`} target="_blank" key={stage.id} className="stage-container">
                <div className="btn-group" title={`${stage.name}: ${stage.status}`}>
                  <button type="button" className={`btn btn-link btn-md mini-pipeline-graph-dropdown-toggle ci-status-icon-${stage.status} gl-button`}>
                    <span className="gl-pointer-events-none">
                      <svg className="gl-icon s16">
                        <use href={`${gitlabLogo}\#status_${stage.status}_borderless`}></use>
                      </svg>
                    </span>
                  </button>
                </div>
              </a>
            )
          }
        </div>
      </td>
      <td>
        <div>
          <div className="flex items-center">
            <svg className="w-3 h-3">
              <use href={`${gitlabLogo}\#timer`} ></use>
            </svg>
            <div className="ml-2">{secondsToTime(pipeline.duration)}</div>
          </div>
          {pipeline.complete && <div className="flex items-center">
            <svg className="w-3 h-3">
              <use href={`${gitlabLogo}\#calendar`} ></use>
            </svg>
            <div className="ml-2">
              <TimeAgo datetime={pipeline.updatedAt} />
            </div>
          </div>}
        </div>
      </td>
    </tr>
  );
};

export default PipelineComponent;
