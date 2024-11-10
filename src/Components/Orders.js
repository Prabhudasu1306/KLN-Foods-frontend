

import React, { useState, useEffect } from 'react';
import "./Orders.css"

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email; 

    useEffect(() => {
        if (!email) {
            setError('No user is logged in.');
            setLoading(false);
            return;
        }
    
        const fetchOrders = async () => {
            console.log('Fetching orders...');
            try {
                const response = await fetch(`http://localhost:8080/api/orders/byEmail?email=${email}`);
    
                // Check if the response is successful
                if (response.ok) {
                    const data = await response.json();
                    if (data.length === 0) {
                        setError('No orders found for this email.');
                    } else {
                        setOrders(data);
                    }
                } else {
                    throw new Error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Error fetching orders: ' + error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchOrders();
    }, [email]);

    return (
        <div className="orders-container">
            <h2 className="orders-title">Your Orders</h2>
            {loading ? (
                <p className="orders-loading">Loading...</p>
            ) : error ? (
                <p className="orders-error">{error}</p>
            ) : (
                orders.length > 0 ? (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Phone Number</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Cost</th>
                                <th>Total Amount</th>
                                {/* <th>Payment Status</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                order.cartItems && order.cartItems.length > 0 ? (
                                    order.cartItems.map(item => (
                                        <tr key={item.id}>
                                            <td>{order.id}</td>
                                            <td>{new Date(order.date).toLocaleDateString()}</td>
                                            <td>{order.phoneNumber}</td>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price}</td>
                                            <td>{order.totalAmount}</td>
                                            {/* <td>{order.paymentStatus === 'Success' ? 'Paid' : 'Not Paid'}</td> */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr key={order.id}>
                                        <td colSpan="8" className="orders-no-items">No items in this order.</td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="orders-no-items">No orders found.</p>
                )
            )}
        </div>
    );
};

export default Orders;

