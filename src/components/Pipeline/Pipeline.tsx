import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Location } from 'history';
import '../../assets/styles/tailwind.css';
import './Pipeline.scss';

interface IProps extends RouteComponentProps<any> {
  token: string,
  location: ILocationState
}
interface ILocationState extends Location<any> {
  token: string,
  apiUrl: string
}

const PipelineComponent: React.FC<IProps> = ({ location }: IProps) => {
  const TOKEN = location.state.token;
  const API_URL = location.state.apiUrl;

  return (
    <div className="pipeline-section">
      <div>Pipeline</div>
      <div>{TOKEN}</div>
      <div>{API_URL}</div>
    </div>
  );
};

export default withRouter(PipelineComponent);
