import React from 'react';
import './LegalPageHeader.css';

interface LegalPageHeaderProps {
  title: string;
  subtitle?: string;
}

export const LegalPageHeader: React.FC<LegalPageHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <header className="legalPageHeader">
      <h1 className="legalPageHeaderTitle">{title}</h1>
      {subtitle && <p className="legalPageHeaderSubtitle">{subtitle}</p>}
      <div className="legalPageHeaderAccentRule" />
    </header>
  );
};
