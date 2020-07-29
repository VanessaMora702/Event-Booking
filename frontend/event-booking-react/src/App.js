import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import './App.css';
import AuthPage from './pages/Auth';
import EventPage from './pages/Event';
import BookingPage from './pages/Booking';
import MainNavigation from './components/Navigation/MainNavigation';


function App() {
  return (
      <BrowserRouter>
      <React.Fragment>
      <MainNavigation/>
        <main>
        <Switch>
        <Redirect from="/" to="/auth" exact/>
        <Route path="/auth" component={AuthPage}/>
        <Route path="/events" component={EventPage}/>
        <Route path="/bookings" component={BookingPage}/>
        </Switch>
        </main>
        </React.Fragment>
      </BrowserRouter>
  );
}

export default App;
