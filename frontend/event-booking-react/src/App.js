import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import './App.css';
import AuthPage from './pages/Auth';
import EventPage from './pages/Event';
import BookingPage from './pages/Booking';


function App() {
  return (
      <BrowserRouter>
        <Switch>
        <Redirect from="/" to="/auth" exact/>
        <Route path="/auth" component={AuthPage}/>
        <Route path="/events" component={EventPage}/>
        <Route path="/bookings" component={BookingPage}/>
        </Switch>
      </BrowserRouter>
  );
}

export default App;
