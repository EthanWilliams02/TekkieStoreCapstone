import React from 'react';
import { Link } from 'react-router-dom';
import './FaqContactCallout.css';

interface FaqContactCalloutProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonTo?: string;
}

export const FaqContactCallout: React.FC<FaqContactCalloutProps> = ({
  title = 'Still have questions?',
  description = "Can't find the answer you're looking for? Our sneaker specialists and support crew are ready to help.",
  buttonText = 'Contact Us',
  buttonTo = '/contact',
}) => {
  return (
    <div className="faqCalloutCard">
      <h3 className="faqCalloutTitle">{title}</h3>
      <p className="faqCalloutText">{description}</p>
      <Link to={buttonTo} className="faqContactBtn">
        {buttonText}
      </Link>
    </div>
  );
};
