import React, { useState } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Home from './Home';
import About from './About';
import Category from './Category';
import Item from './Item';
import FoodList from './FoodList';
import Cart from './Cart';
import CartDetails from './CartDetails';
import { useCart } from './CartContext';
import SignUp from './SignUp';
import Login from './Login';
import './NavbarCom.css';
import Payment from './Payment';
import Admin from './Admin';
import Dashboard from './Dashboard';
import Profile from './Profile';

import Categories from './Categories';
import Orders from './Orders';

const NavbarCom = () => {
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  // eslint-disable-next-line
  const [userEmail, setUserEmail] = useState(null); 
  const [userRole, setUserRole] = useState(null);

  const handleLogout = () => {
    setUserName(null);
    setUserEmail(null); 
    setUserRole(null);
    navigate('/login');
  };

  const handleLoginSuccess = (firstName, email, role) => {
    setUserName(firstName);
    setUserEmail(email); 
    setUserRole(role);
  };

  return (
    <div>
      <Navbar className="custom-navbar" expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {userRole === 'ADMIN' ? (
                <>
                  <Nav.Link as={Link} to="/admin" className="admin-link">Admin</Nav.Link>
                  <Nav.Link as={Link} to="/allcategories" className="allcategories-link">AllCategories</Nav.Link>
                
                  <Nav.Link as={Link} to="/foodlist" className="foodlist-link">Food List</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/home" className="home-link">Home</Nav.Link>
                  <Nav.Link as={Link} to="/about" className="about-link">About</Nav.Link>
                  <Nav.Link as={Link} to="/payment" className="payment-link">Payment</Nav.Link>
                  <Nav.Link as={Link} to="/dashboard" className="dashboard-link">Dashboard</Nav.Link>
                </>
              )}
            </Nav>
            <Nav className="ms-auto">
              <Nav.Link>
                <SearchIcon />
              </Nav.Link>
              <Nav.Link as={Link} to="/cartdetails">
                <ShoppingCartIcon />
                {getCartItemCount() > 0 && <span className="cart-count">{getCartItemCount()}</span>}
              </Nav.Link>
              {!userName ? (
                <>
                  <Nav.Link as={Link} to="/signup" className="signup-link">Sign Up</Nav.Link>
                  <Nav.Link as={Link} to="/login" className="login-link">Login</Nav.Link>
                </>
              ) : (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="success" id="dropdown-basic" className="profile-icon">
                    {userName}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={`/profile`}>Profile</Dropdown.Item> 
                    <Dropdown.Item as={Link} to={`/Orders`}>Orders</Dropdown.Item> 
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        <Routes>
          {userRole !== 'ADMIN' && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/cartdetails" element={<CartDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
            </>
          )}
          
          {userRole === 'ADMIN' && (
            <>
              <Route path="/admin" element={<Admin />} />
              <Route path="/category" element={<Category />} />
              <Route path="/item" element={<Item />} />
              <Route path="/foodlist" element={<FoodList />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/allcategories" element={<Categories />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};

export default NavbarCom;
