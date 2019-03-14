import React from 'react';
import MainBoard from './MainBoard';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import background from '../assets/img/ChessBackground.jpg';
import background1 from '../assets/img/chess1.jpeg';
import background2 from '../assets/img/chess2.jpg';

class App extends React.Component {

  render(){
    let backImage;

    if (screen.width < 450) {
      backImage = {
        zoom: '160%',
        backgroundImage: `url(${background1})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center'
      };
  } else {
    backImage = {
      backgroundImage: `url(${background1})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center'
    };
  }
    return (

          <div style={backImage}>
            <Switch>
              <Route exact path='/:handle' component={MainBoard}/>
              <Route exact path='/' component={MainBoard}/>
            </Switch>
          </div>
    );
  }
}

export default App;
