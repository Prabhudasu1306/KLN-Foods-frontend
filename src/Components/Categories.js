import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AllCategories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/categories/all')
      .then(response => setCategories(response.data))
      .catch(() => setError('Error fetching categories'));
  }, []);

  const deleteCategory = (categoryId) => {
    axios.delete(`http://localhost:8080/categories/delete/${categoryId}`)
      .then(() => {
        setCategories(categories.filter(category => category.id !== categoryId));
      })
      .catch(() => setError('Error deleting category'));
  };

  return (
    <div className="custom-category-list">
      <button className="category-button" onClick={() => navigate('/category')}>
        Add Category
      </button>
      <h2>All Categories</h2>
      {error && <div className="custom-error">{error}</div>}
      <table className="custom-category-table">
        <thead>
          <tr>
            <th>Category Image</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>
                <img src={category.imageUrl} alt={category.name} className="custom-category-image" />
              </td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button
                  className="custom-delete-button"
                  onClick={() => deleteCategory(category.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
