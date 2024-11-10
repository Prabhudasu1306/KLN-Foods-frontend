import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import './CartDetails.css';

const CartDetails = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const { getCartItems, updateItemQuantity } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewAddressFields, setShowNewAddressFields] = useState(false);
  const [newAddress, setNewAddress] = useState({
    houseNumber: '',
    landMark: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const cartItems = getCartItems();
    setItems(cartItems);
    const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];
    setAddresses(savedAddresses);

    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (loggedUser) {
      setEmail(loggedUser.email);
    }
  }, [getCartItems]);

  const { totalPrice, totalGST } = useMemo(() => {
    let totalPrice = 0;
    let totalGST = 0;
    items.forEach(item => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      const gst = parseFloat(item.totalGST) || 0;
      totalPrice += price * quantity;
      totalGST += gst * quantity;
    });
    return { totalPrice, totalGST };
  }, [items]);

  const totalAmount = (totalPrice + totalGST).toFixed(2);

  const handleQuantityChange = (id, change) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
    );
    setItems(updatedItems);
    const updatedItem = updatedItems.find(item => item.id === id);
    updateItemQuantity(id, updatedItem ? updatedItem.quantity : 0);
  };

  const handleProcessToPay = () => {
    if (items.length === 0) {
      alert('Please select items before proceeding to payment.');
      return;
    }

    if (!selectedAddress) {
      alert('Please select an address.');
      return;
    }

    if (!phoneNumber || !email || !date) {
      alert('Please fill in all personal details.');
      return;
    }

    const orderData = {
      items,
      address: selectedAddress,
      totalAmount,
      phoneNumber,
      email,
      date,
    };

    fetch('http://localhost:8080/api/placeOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Order placed successfully:', data);
        navigate('/payment', { state: { orderData, paymentLink: data.paymentLink, totalAmount } });
      })
      .catch(error => {
        console.error('Error placing order:', error);
        alert('There was an error while placing your order.');
      });
  };

  const handleSaveAddress = () => {
    const { houseNumber, landMark, street, city, state, zipCode } = newAddress;

    if (!houseNumber || !landMark || !street || !city || !state || !zipCode) {
      alert('Please fill in all fields.');
      return;
    }

    const isDuplicate = addresses.some(addr => addr.houseNumber === houseNumber && !isEditing);
    if (isDuplicate) {
      alert('This address already exists!');
      return;
    }

    const updatedAddresses = isEditing
      ? addresses.map(addr => (addr.houseNumber === houseNumber ? newAddress : addr))
      : [...addresses, newAddress];

    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    setAddresses(updatedAddresses);
    alert(`${isEditing ? 'Address updated' : 'Address saved'} successfully!`);

    resetNewAddressFields();
  };

  const handleDeleteAddress = (houseNumber) => {
    const updatedAddresses = addresses.filter(addr => addr.houseNumber !== houseNumber);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    setAddresses(updatedAddresses);
    alert('Address deleted successfully!');
  };

  const handleEditAddress = (address) => {
    setIsEditing(true);
    setNewAddress(address);
    setShowNewAddressFields(true); 
  };

  const resetNewAddressFields = () => {
    setNewAddress({
      houseNumber: '',
      landMark: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
    });
    setIsEditing(false);
    setShowNewAddressFields(false);
  };

  return (
    <div className="cart-details-container">
      {/* Personal Details Section */}
      <div className="personal-details-section">
        <h3>Personal Details</h3>
        <div className="personal-details-form">
          <input
            className="personal-detail-input"
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
          />
          <input
            className="personal-detail-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="personal-detail-input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
      </div>

   
      <div className="cart-items-address-section">
        <div className="left-section">
          <h3>Cart Items</h3>
          <div className="cart-item-list">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>GST</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>₹{parseFloat(item.price).toFixed(2)}</td>
                      <td>₹{parseFloat(item.totalGST).toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <div className="cart-quantity-controls">
                          <button
                            className="cart-quantity-button"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            -
                          </button>
                          <span className="cart-quantity-display">{item.quantity}</span>
                          <button
                            className="cart-quantity-button"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">
                      <span
                        style={{ color: 'blue', cursor: 'pointer' }}
                        onClick={() => navigate('/home')}
                      >
                        Visited the Restaurant
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="cart-summary">
            <p>Total Price: ₹{totalPrice}</p>
            <p>Total GST: ₹{totalGST}</p>
            <p>Total Amount: ₹{totalAmount}</p>
          </div>
        </div>

       
        <div className="right-section">
          <h3>Delivery Address</h3>
          <div className="address-list">
            {addresses.length > 0 ? (
              <ul>
                {addresses.map((address, index) => (
                  <li key={index}>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name="address"
                          value={address.houseNumber}
                          checked={selectedAddress && selectedAddress.houseNumber === address.houseNumber}
                          onChange={() => setSelectedAddress(address)}
                        />
                        {address.houseNumber}, {address.landMark}, {address.street}, {address.city}, {address.state}, {address.zipCode}
                      </label>
                      <button onClick={() => handleEditAddress(address)}>Edit</button>
                      <button onClick={() => handleDeleteAddress(address.houseNumber)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No addresses saved.</p>
            )}

           
            {showNewAddressFields && (
              <div className="new-address-form">
                <input
                  className="address-input"
                  type="text"
                  placeholder="House Number"
                  value={newAddress.houseNumber}
                  onChange={e => setNewAddress({ ...newAddress, houseNumber: e.target.value })}
                />
                <input
                  className="address-input"
                  type="text"
                  placeholder="Landmark"
                  value={newAddress.landMark}
                  onChange={e => setNewAddress({ ...newAddress, landMark: e.target.value })}
                />
                <input
                  className="address-input"
                  type="text"
                  placeholder="Street"
                  value={newAddress.street}
                  onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                />
                <input
                  className="address-input"
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                />
                <input
                  className="address-input"
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                />
                <input
                  className="address-input"
                  type="text"
                  placeholder="Zip Code"
                  value={newAddress.zipCode}
                  onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                />
                <button onClick={handleSaveAddress}>Save Address</button>
                <button onClick={resetNewAddressFields}>Cancel</button>
              </div>
            )}

            {/* Show Add New Address Button */}
            <button
              className="add-address-button"
              onClick={() => setShowNewAddressFields(true)}
            >
              Add New Address
            </button>
          </div>
        </div>
      </div>

      {/* Process to Pay Button */}
      <div className="process-to-pay">
        <button className="process-btn" onClick={handleProcessToPay}>
          Process to Pay
        </button>
      </div>
    </div>
  );
};

export default CartDetails;
