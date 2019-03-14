import React from 'react';
import PropTypes from 'prop-types';
import github from '../assets/img/Github.png';
import linkedIn from '../assets/img/LinkedIn.png';
import email from '../assets/img/email.png';

class AboutModal extends React.Component {

  render(props){
    if (this.props.aboutModal === false) {
      return null;
    }

    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: 50
    };
    let modalStyle;
    if (screen.width < 450) {
      modalStyle = {
        maxWidth: 600,
        minHeight: 200,
        fontSize: 17,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 80,
        paddingTop: 5,
        textAlign: 'center'
      };
    } else {
      modalStyle = {
        maxWidth: 600,
        minHeight: 200,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 50,
        padding: 30,
        textAlign: 'center'
      };
    }


    const endOfGameMessage = {
      fontSize: 50,
      color: 'white'
    };

    const moveImage = {
      padding: 'auto',
      width: 40,
      height: 40,
      backgroundColor: 'white',
      borderRadius: '100%',
      float: 'left',
      marginRight: 20
    };
    const move = {
      //float: 'left'
    };
    const info = {
      textAlign: 'left',
      lineHeight: '2.55em'
    };

    const emailImage = {
      padding: 'auto',
      width: 40,
      height: 40,
      borderStyle: 'solid',
      borderWidth: 3,
      borderColor: 'white',
      backgroundColor: 'white',
      borderRadius: '100%',
      float: 'left',
      marginRight: 20
    };
    const moveContactInfo = {
      width: 240,
      marginLeft: 'auto',
      marginRight: 'auto',
    };

    return(
      <div style={backdropStyle}>

      <style jsx>{`
        p, li, h4 {
          color: white;

        }
        img {
          width: 100%;
        }

        `}</style>
        <div style={modalStyle}>
        <p style={endOfGameMessage}></p>
        <h4>About Me</h4>
        <p>My name is Eddie Harris and I created this game in React (with Google Firebase) as a side project. I transitioned into web and software development after spending 5+ years in the legal field. I really enjoy creating products from the ground up that people can use and enjoy.</p>
        <p> Feel free to check out my GitHub and LinkedIn profiles or reach out to me directly. Thank you for playing the game!</p>
        <br/>
        <div style={moveContactInfo}>
        <div style={move}>
        <a href="https://github.com/harrisejm/Chess" target="_blank">
        <div style={moveImage}>
        <img src={github}/>
        </div>
        <p style={info}>Github: Online Chess</p>
        </a>
        </div>
        <br/>
        <div style={move}>
        <a href="https://www.linkedin.com/in/edward-harris" target="_blank">
        <div style={moveImage}>
        <img src={linkedIn}/>
        </div>
        <p style={info}>LinkedIn: Edward Harris</p>
        </a>
        </div>
        <br/>
        <div style={move}>
        <a href="mailto:harrisejm@gmail.com">
        <div style={emailImage}>
        <img src={email}/>
        </div>
        <p style={info}>Email: Edward Harris</p>
        </a>
        </div>
        </div>
        <br/>
        <button onClick={()=>this.props.closeAboutModal()}>Close</button>
        </div>
        </div>
      );
    }
  }
  AboutModal.propTypes = {

  };

  export default AboutModal;
