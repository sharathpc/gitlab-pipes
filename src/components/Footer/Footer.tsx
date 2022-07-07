import React from 'react';
import '../../assets/styles/tailwind.css';


const FooterComponent: React.FC = () => {
  return (
    <div className="py-2 text-center">
      <span className="font-semibold">GitLab Pipes</span>
      <span className="mx-1">made with</span>
      <i className="icon-heart text-red-600 align-middle"></i>
    </div>
  );
};

export default FooterComponent;
