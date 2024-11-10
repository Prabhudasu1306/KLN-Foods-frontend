// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './Components/CartContext';
import { AuthProvider } from './Components/AuthContext';
import { PaymentProvider } from './Components/PaymentContext'; // Import the PaymentProvider
import { UserProvider } from './Components/UserContext'; // Import the UserProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <PaymentProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </PaymentProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
