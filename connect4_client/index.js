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
                  moves: {}}
  }

  renderBoard = () => {
    const rows = [];
    for(let i = 1; i <= 6; ++i){
      const rowItem = [];
      for(let j = 1; j <= 7; ++j){
        const ind = (7 * i) + j;
        if(this.state.moves[ind] == 'player1'){
          rowItem.push(<div className = 'boardCell'>
                          <button className = 'player1' />
                        </div>)
        }
        else if(this.state.moves[ind] == 'player2'){
          rowItem.push(<div className = 'boardCell'>
                          <button className = 'player2' />
                        </div>)
        }
        else {
          rowItem.push(<div className = 'boardCell'>
                          <button className = 'blank' />
                        </div>)
        }
      }
      rows.push(<div>{rowItem}</div>)
    }
    return rows;
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
          {this.renderBoard()}
        </div>
        :<div className = 'login' >
          <input className = 'uname' placeholder = "Enter username" onChange = {this.handleChange} value = {this.state.uname} />
          <button className = 'submit' onClick = {() => this.handleClick(this.state.uname)}>
            Login
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
