import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Leaderboard from './components/leaderboard.component';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <Switch>
              <Route path='/leaderboard' component={ Leaderboard } />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
