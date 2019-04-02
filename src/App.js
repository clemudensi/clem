import React, { Component } from 'react';
import LandedCost from './views/LandedCost'
import {Route, Switch} from 'react-router-dom';
import IndexRoute from './routes/index';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={ LandedCost } />
          {IndexRoute.map((prop, key) => <Route exact path={ prop.path } key={ key } component={ prop.component } />)}
        </Switch>
      </div>
    );
  }
}

export default App;
