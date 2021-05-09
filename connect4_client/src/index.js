import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {w3cwebsocket as W3CWebsocket} from 'websocket';

const client = new W3CWebsocket ('ws://192.168.0.199:8000');

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {pnum: 0,
                  uname: '',
                  isloggedin: false,
                  moves: {}}
  }

  renderBoard = () => {
    const rows = [];
    for(let i = 1; i <= 6; ++i){
      const rowItem = [];
      for(let j = 1; j <= 7; ++j){
        const ind = (7 * i) + j;
        if(this.state.moves[ind] === 'player1'){
          rowItem.push(<div className = 'boardCell'>
                          <button className = 'player1' onClick = {() => this.handleMove(ind)} />
                        </div>)
        }
        else if(this.state.moves[ind] === 'player2'){
          rowItem.push(<div className = 'boardCell'>
                          <button className = 'player2' onClick = {() => this.handleMove(ind)} />
                        </div>)
        }
        else {
          rowItem.push(<div className = 'boardCell'>
                          <button className = 'blank' onClick = {() => this.handleMove(ind)} />
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

  handleLogin = (val) => {
    this.setState({isloggedin: true})
    client.send(JSON.stringify({
      type: "login",
      user: val
    }));
  }

  handleMove = (id) => {
    client.send(JSON.stringify({
      type: "message",
      user: this.state.uname,
      move: id
    }))
  }

  componentDidMount(){
    client.onopen = () => {
      console.log('connected');
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('From Server: ', dataFromServer);
      if(dataFromServer.type === 'login' && dataFromServer.user === this.state.uname){
        this.setState({pnum: dataFromServer.id})
      }
      else if(dataFromServer.type === 'message' && dataFromServer.user === this.state.uname) {
        if(this.state.pnum == 1){
          const move = this.state.moves;
          move[dataFromServer.move] = 'player1';
          this.setState({moves: move})
        }
        else if(this.state.pnum == 2){
          const move = this.state.moves;
          move[dataFromServer.move] = 'player2';
          this.setState({moves: move})
        }
      }
      else if(dataFromServer.type === 'message' && dataFromServer.user != this.state.uname) {
        if(this.state.pnum == 1){
          const move = this.state.moves;
          move[dataFromServer.move] = 'player2';
          this.setState({moves: move})
        }
        else if(this.state.pnum == 2){
          const move = this.state.moves;
          move[dataFromServer.move] = 'player1';
          this.setState({moves: move})
        }
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
          <button className = 'submit' onClick = {() => this.handleLogin(this.state.uname)}>
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
