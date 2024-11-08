import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FoodList.css'; 
import { Link } from 'react-router-dom'; 

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get('http://localhost:8080/foods/all');
        setFoods(response.data);
      } catch (error) {
        console.error('Error fetching foods:', error);
        setErrors({ fetch: 'Error fetching foods. Please try again later.' });
      }
    };

    fetchFoods();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/foods/delete/${id}`);
      setFoods(foods.filter((food) => food.id !== id));
    } catch (error) {
      console.error('Error deleting food item:', error);
      setErrors({ delete: 'Error deleting food item. Please try again later.' });
    }
  };

  return (
    <div className="custom-food-list">
      <h2>Food Items</h2>
      {errors.fetch && <p className="custom-error">{errors.fetch}</p>}

      <Link to="/item">
        <button className="add-item-button">Add Item</button> 
      </Link>

      <table className="custom-food-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>State GST</th>
            <th>Central GST</th>
            <th>Total GST</th>
            <th>Total Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {foods.map((food) => (
            <tr key={food.id}>
              <td>
                <img src={food.imageUrl} alt={food.name} className="custom-food-image" />
              </td>
              <td>{food.name}</td>
              <td>{food.price}</td>
              <td>{food.stateGST}</td>
              <td>{food.centralGST}</td>
              <td>{food.totalGST}</td>
              <td>{food.totalPrice}</td>
              <td>{food.description}</td>
              <td>{food.categoryName || 'Unknown'}</td>
              <td>
                <button className="custom-delete-button" onClick={() => handleDelete(food.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodList;
