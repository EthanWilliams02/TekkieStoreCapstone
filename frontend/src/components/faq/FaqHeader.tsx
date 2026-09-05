import React from 'react';
import { LegalPageHeader } from '../legal/LegalPageHeader';

interface FaqHeaderProps {
  title?: string;
  subtitle?: string;
}

export const FaqHeader: React.FC<FaqHeaderProps> = ({
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know about orders, shipping, sizes, and returns',
}) => {
  return <LegalPageHeader title={title} subtitle={subtitle} />;
};
