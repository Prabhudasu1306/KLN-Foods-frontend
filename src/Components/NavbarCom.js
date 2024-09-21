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
import AddRestaurant from './AddRestaurant';
import './NavbarCom.css';
import Feedback from './Feedback';

const NavbarCom = () => {
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null); 

  const handleLogout = () => {
    setUserName(null); 
    navigate('/login'); 
  };


  const handleLoginSuccess = (firstName) => {
    setUserName(firstName); 
  };

  return (
    <div>
      <Navbar className="custom-navbar" expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/home" className="home-link">Home</Nav.Link>
              <Nav.Link as={Link} to="/about" className="about-link">About</Nav.Link>
              <Nav.Link as={Link} to="/category" className="category-link">Category</Nav.Link>
              <Nav.Link as={Link} to="/item" className="item-link">Item</Nav.Link>
              <Nav.Link as={Link} to="/foodlist" className="foodlist-link">FoodList</Nav.Link>
              <Nav.Link as={Link} to="/addrestaurant" className="restaurant-link">Add Restaurant</Nav.Link>
              {/*  */}
            </Nav>
            <Nav className="ms-auto">
              <Nav.Link>
                <SearchIcon />
              </Nav.Link>
              <Nav.Link as={Link} to="/cartdetails">
                <ShoppingCartIcon />
                {getCartItemCount() > 0 && <span className="cart-count">{getCartItemCount()}</span>}
              </Nav.Link>
              {!userName && ( 
                <>
                  <Nav.Link as={Link} to="/signup" className="signup-link">SignUp</Nav.Link>
                  <Nav.Link as={Link} to="/login" className="login-link">Login</Nav.Link>
                </>
              )}
              {userName && (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="success" id="dropdown-basic" className="profile-icon">
                    {userName.charAt(0).toUpperCase()}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
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
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/category" element={<Category />} />
          <Route path="/item" element={<Item />} />
          <Route path="/foodlist" element={<FoodList />} />
          <Route path="/addrestaurant" element={<AddRestaurant />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cartdetails" element={<CartDetails />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="feedback" element={<Feedback/>} />
        </Routes>
      </div>
    </div>
  );
};

export default NavbarCom;