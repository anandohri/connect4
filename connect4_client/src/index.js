import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {w3cwebsocket as W3CWebsocket} from 'websocket';

const client = new W3CWebsocket ('ws://192.168.0.199:8000');

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {uname: '',
                  isloggedin: false,
                  messages: []}
  }

  handleChange = (e) => {
    this.setState({uname: e.target.value})
  }

  handleClick = (val) => {
    this.setState({isloggedin: true})
    client.send(JSON.stringify({
      type: "message",
      user: val
    }));
  }

  componentDidMount(){
    client.onopen = () => {
      console.log('connected');
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('From Server: ', dataFromServer);
      if(dataFromServer.type === 'message') {
        this.setState((state) => ({
          messages: [... state.messages,{
            user: dataFromServer.user
          }]
        }))
      }
    };
  }

  render(){
    return(
      <div>
        {this.state.isloggedin ?
        <div>
          You are logged in
          <button onClick = {() => this.handleClick(this.state.uname)} >
            Check Username
          </button>
          {this.state.messages.map(msg => <p>User: {msg.user}</p>)}
        </div>
        :<div style = {{ padding: '200px 40px' }} >
          <input placeholder = "Enter username" onChange = {this.handleChange} value = {this.state.uname} />
          <button onClick = {() => this.handleClick(this.state.uname)}>
            Submit
          </button>
        </div>}
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
