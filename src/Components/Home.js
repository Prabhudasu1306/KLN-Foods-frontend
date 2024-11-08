import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick'; 
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
import { Link } from 'react-router-dom';
import './Home.css'; 

const Home = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get('http://localhost:8080/categories/all');
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCategories();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  };
  
  return (
    <div className="home-container">
      <div className="home-image-container">
        <img
          src="https://cdn.pixabay.com/photo/2024/04/23/09/33/ai-generated-8714546_960_720.jpg"
          alt="India"
          className="home-image"
        />
        <div className="home-overlay">
          <h1 className="home-title">KLN Hotels</h1>
          <p className="home-quote">Good food is the foundation of genuine happiness.</p>
        </div>
      </div>

      <h2 className="top-items-text">Categories</h2>

      {categories.length > 6 ? (
        <div className="categories-slider">
          <Slider {...settings}>
            {categories.map(category => (
              <Link
                key={category.category_id}
                to={`/cart?category=${category.name}`}
                className="category-link"
              >
                <div className="category-item">
                  <img src={category.imageUrl} alt={category.name} className="category-image" />
                  <h2 className="category-name">{category.name}</h2>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="categories-list">
          {categories.map(category => (
            <Link
              key={category.category_id}
              to={`/cart?category=${category.name}`}
              className="category-link"
            >
              <div className="category-item">
                <img src={category.imageUrl} alt={category.name} className="category-image" />
                <h2 className="category-name">{category.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
