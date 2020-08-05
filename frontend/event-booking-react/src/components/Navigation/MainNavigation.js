import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

const mainNavigation = props => (
  // FUNCTIONAL COMPONENT
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>Event Booking</h1>
          </div>
          {/* allow user to click on authenticate token is null  */}
          <nav className="main-navigation__items">
            <ul>
              {!context.token && <li>
                <NavLink to="/auth">Authenticate</NavLink>
              </li>}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {/* allow user to click on authenticate token has value  */}
              {context.token &&  <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>}
        
            </ul>
          </nav>
        </header>
      )
    }}
  </AuthContext.Consumer>

);

export default mainNavigation;