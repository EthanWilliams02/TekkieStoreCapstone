import React from 'react';
import './FaqPageWrapper.css';

interface FaqPageWrapperProps {
  children: React.ReactNode;
}

export const FaqPageWrapper: React.FC<FaqPageWrapperProps> = ({ children }) => {
  return (
    <div className="faqPageWrapper">
      <div className="faqPageContainer">{children}</div>
    </div>
  );
};
