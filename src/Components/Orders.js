import React, { useState, useEffect } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
        alert('Error fetching orders: ' + error.message);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Item Name</th>
              <th>Cost</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              order.cartItems.map(item => (
                <tr key={item.id}>
                  <td>{order.id}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{order.paymentStatus === 'Success' ? 'Paid' : 'Not Paid'}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Orders;

