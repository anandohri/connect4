import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {w3cwebsocket as W3CWebsocket} from 'websocket';

const client = new W3CWebsocket ('ws://192.168.0.199:8000');

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {name: ''}
  }

  handleChange = (e) => {
    this.setState({name: e.target.value})
  }

  handleClick = (val) => {
    client.send(JSON.stringify({
      type: "message",
      msg: val
    }));
  }

  componentDidMount(){
    client.onopen = () => {
      console.log('connected');
    };

    client.onmessage = (message) => {
      const nameFromServer = JSON.parse(message.data);
      console.log('From Server: ', nameFromServer);
    };
  }

  render(){
    return(
      <div>
        <input onChange = {this.handleChange} value = {this.state.name} label = "Enter Name" />
        <button onClick = {() => this.handleClick(this.state.name)}>
          Submit
        </button>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
