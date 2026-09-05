import React from 'react';
import './LegalSection.css';

interface LegalSectionProps {
  heading: string;
  body: string;
}

export const LegalSection: React.FC<LegalSectionProps> = ({ heading, body }) => {
  return (
    <section className="legalSection">
      <h2 className="legalSectionHeading">{heading}</h2>
      <p className="legalSectionText">{body}</p>
    </section>
  );
};
