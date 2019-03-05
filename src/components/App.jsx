import React from 'react';
import MainBoard from './MainBoard';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';


class App extends React.Component {


  render(){
    return (
      <div>
      <Link to={"/test"}>Single player</Link>
      <br/>
       <Link to={"/playerOne"}>Player 1</Link>
       <br/>
       <Link to={"/playerTwo"}>Player 2</Link>

        <div>
          <div>
            <Switch>
              <Route exact path='/:handle' component={MainBoard}/>
              <Route exact path='/test' component={MainBoard}/>

            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
