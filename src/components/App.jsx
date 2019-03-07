import React from 'react';
import MainBoard from './MainBoard';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';


class App extends React.Component {


  render(){
    return (


  <div>
        <div>
          <div>
            <Switch>
              <Route exact path='/:handle' component={MainBoard}/>
              <Route exact path='/' component={MainBoard}/>

            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
