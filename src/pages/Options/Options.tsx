import React from 'react';
import './Options.scss';

interface IProps {
  title: string;
}

const Options: React.FC<IProps> = ({ title }: IProps) => {
  return (
    <div className="OptionsContainer">{title.toUpperCase()} PAGE</div>
  );
};

export default Options;
