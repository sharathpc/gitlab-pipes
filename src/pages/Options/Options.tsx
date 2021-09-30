import React, { FC } from 'react';
import './Options.scss';

interface Props {
  title: string;
}

const Options: FC<Props> = ({ title }: Props) => {
  return (
    <div className="OptionsContainer">{title.toUpperCase()} PAGE</div>
  );
};

export default Options;
