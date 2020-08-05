import React, {Component} from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import './App.css';
import AuthPage from './pages/Auth';
import EventPage from './pages/Event';
import BookingPage from './pages/Booking';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

class App extends Component {
  state = {
    token: null,
    userId: null,

  };

  login = (token, userId, tokenExpiration) => {
    this.setState({token: token, userId: userId});
  };

  logout = () => {
    this.setState({token: null, userId: null});
  }
  render() {
    return (
        <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout}}>
        <MainNavigation/>
          <main>
          <Switch>
          {!this.state.token && <Redirect from="/" to="/auth" exact/>}
          {this.state.token && <Redirect from="/" to="/events" exact/>}
          {this.state.token && <Redirect from="/auth" to="/events" exact/>}
          {!this.state.token && <Route path="/auth" component={AuthPage}/>}
          {<Route path="/events" component={EventPage}/>}
          {this.state.token && <Route path="/bookings" component={BookingPage}/>}
          </Switch>
          </main>
          </AuthContext.Provider>
          </React.Fragment>
        </BrowserRouter>
    );
  }
}

export default App;
