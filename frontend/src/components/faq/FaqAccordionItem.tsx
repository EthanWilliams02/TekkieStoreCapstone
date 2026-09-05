import React from 'react';
import { ChevronDown } from 'lucide-react';
import './FaqAccordionItem.css';

interface FaqAccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const FaqAccordionItem: React.FC<FaqAccordionItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
}) => {
  return (
    <div className={`faqItem ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="faqQuestionBtn"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="faqQuestionText">{question}</span>
        <ChevronDown size={20} className="faqChevron" />
      </button>

      <div className="faqAnswerWrapper">
        <p className="faqAnswerText">{answer}</p>
      </div>
    </div>
  );
};
