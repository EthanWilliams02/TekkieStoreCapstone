import React from 'react';
import './LegalPageWrapper.css';

interface LegalPageWrapperProps {
  children: React.ReactNode;
}

export const LegalPageWrapper: React.FC<LegalPageWrapperProps> = ({ children }) => {
  return (
    <div className="legalPageWrapper">
      <div className="legalPageContainer">{children}</div>
    </div>
  );
};
