import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {w3cwebsocket as W3CWebsocket} from 'websocket';

const client = new W3CWebsocket ('ws://192.168.0.199:8000');

class Connect4 extends React.Component{
  constructor(props){
    super(props);
    this.state = {pnum: 0,
                  uname: '',
                  isloggedin: false,
                  moves: {},
                  prev: 0,
                  isWinner: 'NA',
                  ready: 'n'}
  }

  calcWinner = (current) => {
    const currPlayer = 'player' + current;
    const moves = this.state.moves;
    let found = 'n';
    for(let i = 5; i >= 0; --i){
      for(let j = 1; j <= 7; ++j){
        const ind = (i * 7) + j;
        if(moves[ind] == currPlayer &&
            moves[ind + 1] == currPlayer &&
            moves[ind + 2] == currPlayer &&
            moves[ind + 3] == currPlayer){
          moves[ind] = 'winner' + current;
          moves[ind + 1] = 'winner' + current;
          moves[ind + 2] = 'winner' + current;
          moves[ind + 3] = 'winner' + current;
          found = 'y';
          break;
        }
        else if(moves[ind] == currPlayer &&
                  moves[ind - 7] == currPlayer &&
                  moves[ind - 14] == currPlayer &&
                  moves[ind - 21] == currPlayer){
          moves[ind] = 'winner' + current;
          moves[ind - 7] = 'winner' + current;
          moves[ind - 14] = 'winner' + current;
          moves[ind - 21] = 'winner' + current;
          found = 'y';
          break;
        }
        else if(moves[ind] == currPlayer &&
                  moves[ind - 6] == currPlayer &&
                  moves[ind - 12] == currPlayer &&
                  moves[ind - 18] == currPlayer){
          moves[ind] = 'winner' + current;
          moves[ind - 6] = 'winner' + current;
          moves[ind - 12] = 'winner' + current;
          moves[ind - 18] = 'winner' + current;
          found = 'y';
          break;
        }
        else if(moves[ind] == currPlayer &&
                  moves[ind - 8] == currPlayer &&
                  moves[ind - 16] == currPlayer &&
                  moves[ind - 24] == currPlayer){
          moves[ind] = 'winner' + current;
          moves[ind - 8] = 'winner' + current;
          moves[ind - 16] = 'winner' + current;
          moves[ind - 24] = 'winner' + current;
          found = 'y';
          break;
        }
      }
      if(found === 'y'){
        this.setState({moves: moves});
        if(this.state.pnum === current){
          client.send(JSON.stringify({
            type: "winner",
            user: this.state.uname,
            number: this.state.pnum
          }));
        }
        break;
      }
    }
  }

  renderBoard = () => {
    const rows = [];
    for(let i = 0; i < 6; ++i){
      const rowItem = [];
      for(let j = 1; j <= 7; ++j){
        const ind = (7 * i) + j;
        if(this.state.moves[ind] === 'player1'){
          rowItem.push(<div className = 'boardCell'>
                          <button className = 'player1' onClick = {() => this.handleMove(i, j)} />
                        </div>)
        }
        else if(this.state.moves[ind] === 'player2'){
          rowItem.push(<div className = 'boardCell'>
                          <button className = 'player2' onClick = {() => this.handleMove(i, j)} />
                        </div>)
        }
        else if(this.state.moves[ind] === 'winner1'){
          rowItem.push(<div className = 'winnerCell'>
                          <button className = 'player1' />
                        </div>)
        }
        else if(this.state.moves[ind] === 'winner2'){
          rowItem.push(<div className = 'winnerCell'>
                          <button className = 'player2' />
                        </div>)
        }
        else {
          const lower = (7 * (i + 1)) + j;
          if(this.state.moves[lower] === 'player1' || this.state.moves[lower] === 'player2' || i === 5){
            rowItem.push(<div className = 'boardCell'>
                            <button className = 'blank' onClick = {() => this.handleMove(i, j)} />
                          </div>)
          }
          else{
            rowItem.push(<div className = 'boardCell'>
                            <button className = 'blankUnmovable' onClick = {() => this.handleMove(i, j)} />
                          </div>)
          }
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
    if(this.state.uname != ''){	
      client.send(JSON.stringify({
        type: "login",
        user: val
      }));
    }
    else{
      alert('Please Enter Username');
    }
  }

  handleMove = (i, j) => {
    const id = (7 * i) + j;
    if(this.state.ready === 'y'){
      if(this.state.isWinner === 'NA' && this.state.moves[id] !== 'player1' && this.state.moves[id] !== 'player2'){
        if(this.state.prev === 0){
          if(this.state.pnum === 1 && i === 5){
            client.send(JSON.stringify({
              type: "message",
              user: this.state.uname,
              move: id,
              id: this.state.pnum
            }))
          }
        } else if(i === 5 && this.state.pnum != this.state.prev){
          client.send(JSON.stringify({
            type: "message",
            user: this.state.uname,
            move: id,
            id: this.state.pnum
          }))
        }
        else{
          const lower = (7 * (i + 1)) + j;
          if((this.state.moves[lower] === 'player1' || this.state.moves[lower] === 'player2') 
            && this.state.pnum != this.state.prev){
            client.send(JSON.stringify({
              type: "message",
              user: this.state.uname,
              move: id,
              id: this.state.pnum
            }))
          }
        }
      }
    }
  }

  handleRestart = () => {
    client.send(JSON.stringify({
      type: "restart",
      user: this.state.uname,
    }));
  }

  componentDidMount(){
    client.onopen = () => {
      console.log('connected');
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('From Server: ', dataFromServer);
      if(dataFromServer.type === 'login' && dataFromServer.user === this.state.uname){
        this.setState({pnum: dataFromServer.id, isloggedin: true})
      }
      else if(dataFromServer.type === 'message' && dataFromServer.id == this.state.pnum) {
        const move = this.state.moves;
        move[dataFromServer.move] = 'player' + this.state.pnum;
        this.setState({moves: move, prev: this.state.pnum});
        this.calcWinner(this.state.pnum);
      }
      else if(dataFromServer.type === 'message' && dataFromServer.id != this.state.pnum) {
        if(this.state.pnum === 1){
          const move = this.state.moves;
          move[dataFromServer.move] = 'player2';
          this.setState({moves: move, prev: 2});
          this.calcWinner(2);
        }
        else if(this.state.pnum === 2){
          const move = this.state.moves;
          move[dataFromServer.move] = 'player1';
          this.setState({moves: move, prev: 1});
          this.calcWinner(1);
        }
      }
      else if(dataFromServer.type === 'restart'){
        alert('Player: ' + dataFromServer.user + ' wants to restart the game.');
        this.setState({moves: {}, prev: 0, isWinner: 'NA'});
        alert('Game Reset');
      }
      else if(dataFromServer.type === 'winner'){
        this.setState({isWinner: dataFromServer.user + dataFromServer.number})
      }
      else if(dataFromServer.type === 'loginFailed'){
        alert("Room full")
      }
      else if(dataFromServer.type === 'ready'){
        this.setState({ready: 'y'});
      }
    };
  }

  render(){
    return(
      <div>
        {this.state.isloggedin ?
        <div>
          <div className = 'stats'>
            <p className = 'loggedInHeader'> Connect 4</p>
            {this.state.isWinner != 'NA' ?
            <div>
              {this.state.pnum == this.state.isWinner.substring(this.state.isWinner.length-1, this.state.isWinner.length) ?
                <p className = 'win'>===You Won===</p>
                : <p className = 'lost'>===You Lost===</p>
              }
            </div>
            : <div className = 'basicInfo'>
              {this.state.pnum === 1? 
                <p className = 'redMove'>Name: {this.state.uname} <br />Color: Red</p>
                : <p className = 'yellowMove'>Name: {this.state.uname} <br />Color: Yellow</p>
              }
              {this.state.prev == 0 ? 
                <div>
                  {this.state.ready === 'y' ? 
                    <div>
                      {this.state.pnum == 1 ?
                        <div>
                          <p className = 'redMove'>Current Move: Red</p>
                        </div>
                        : <div>
                            <p className = 'redMove'>Current Move: Red</p>
                          </div>
                      }
                    </div>
                    : <p className = 'firstMove'>Waiting for other player to connect</p>
                  }
                </div>
                : <div>
                  {this.state.prev != this.state.pnum ? 
                    <div>
                      {this.state.pnum == 1 ?
                        <div>
                          <p className = 'redMove'>Current Move: Red</p>
                        </div>
                        : <div>
                            <p className = 'yellowMove'>Current Move: Yellow</p>
                          </div>
                      }
                    </div>
                    : <div>
                      {this.state.pnum == 1 ?
                        <div>
                          <p  className = 'yellowMove'>Current Move: Yellow</p>
                        </div>
                        : <div>
                            <p className = 'redMove'>Current Move: Red</p>
                          </div>
                      }
                      </div>
                  }
                  </div>
                }
              </div>
            }
            <button className = 'restart' onClick = {this.handleRestart}>
              Restart Game
            </button>
          </div>
          <div className = 'playBoard'>
            {this.renderBoard()}
          </div>
        </div>
        :<div> 
          <p className = 'header'> Connect 4</p>
          <div className = 'login' >
            <input className = 'uname' placeholder = "Enter username" onChange = {this.handleChange} value = {this.state.uname} />
            <button className = 'submit' onClick = {() => this.handleLogin(this.state.uname)}>
              Login
            </button>
          </div>
        </div>}
      </div>
    )
  }
}

ReactDOM.render(
  <Connect4 />,
  document.getElementById('root')
);
