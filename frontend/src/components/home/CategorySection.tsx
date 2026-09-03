import { Link } from 'react-router-dom';
import "./CategorySection.css";
import { ArrowRight } from "lucide-react";

export const CategorySection = () => {
  const categories = [
    {
      id: 1,
      name: "NEW DROPS",
      subtitle: "The latest heat.",
      image: "/category_new_drops_boxes.jpg",
      link: "/new-drops",
    },
    {
      id: 2,
      name: "MEN",
      subtitle: "Men's footwear.",
      image: "/category_men_sneakers_standing_outfit.jpg",
      link: "/men",
    },
    {
      id: 3,
      name: "WOMEN",
      subtitle: "Women's footwear.",
      image: "/category_women_sneakers_sitting_orange.jpg",
      link: "/women",
    },
    {
      id: 4,
      name: "KIDS",
      subtitle: "Playful comfort & mini heat.",
      image: "/category_sneakers_1788049733131.jpg",
      link: "/kids",
    },
  ];

  return (
    <section className="category-section">
      <div className="category-container">
        <div className="category-header">
          <h2 className="section-title">SHOP BY CATEGORY</h2>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.id} to={category.link} className="category-card">
              <div className="category-image-wrapper">
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-image"
                />
                <div className="category-overlay"></div>
              </div>
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-subtitle">{category.subtitle}</p>
                <div className="category-action">
                  Shop Now <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
