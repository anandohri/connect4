import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {w3cwebsocket as W3CWebsocket} from 'websocket';

const client = new W3CWebsocket ('ws://192.168.0.199:8000');

class App extends React.Component{
  componentDidMount(){
    client.onopen = () => {
      console.log('connected');
    };
  }

  render(){
    return 'Testing';
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
