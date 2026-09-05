import React from 'react';
import './FaqCategoryPills.css';

interface FaqCategoryPillsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export const FaqCategoryPills: React.FC<FaqCategoryPillsProps> = ({
  categories,
  activeCategory,
  onSelect,
}) => {
  return (
    <div className="faqPillsWrapper">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`faqPill ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
