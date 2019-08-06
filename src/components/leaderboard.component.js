import React, { Component } from 'react';
import * as Colyseus from "colyseus.js";
import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Leaderboard extends Component {
  constructor(props) {
    super(props);

    this.onChangeCode = this.onChangeCode.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      room: '',
      page: 'init',
      users: [],
      step: 0,
      score: [],
      question: '',
      answers: []
    }

    var endpoint = window.location.protocol.replace("http", "ws") + "//" + window.location.hostname;

    // development server
    if (window.location.port && window.location.port !== "80") { endpoint += ":2567" }

    // endpoint = "ws://192.168.0.39:2567";
    this.colyseus = new Colyseus.Client(endpoint);
  }

  msgListener(message) {
    if (message.key === 'join') {
      console.log("response join", message.data);
      this.setState({users:message.data});
    } else if (message.key === 'test') {
      console.log("response - test");
      this.setState({page:'game', step:message.data.step, question: message.data.q, answers: message.data.a});
    } else if (message.key === 'select') {
      console.log("response - select");
      this.setState({page:'game', users:message.data});
    } else if (message.key === 'result') {
      console.log("result", message.data);
      this.setState({page:'result', users:message.data});
    } else if (message.key === 'ready') {
      console.log("ready", message.data);
    }
  }

  joinListener() {
    console.log('joined');
    this.room.onMessage.add(this.msgListener.bind(this));
    this.setState({
      page: 'wait'
    })
  }

  onChangeCode(e) {
    this.setState({
      room: e.target.value,
    })
  }

  onSubmit(e) {
    e.preventDefault();    
    console.log('joining room', this.state.room);
    this.room = this.colyseus.join(this.state.room, {client:'leaderboard'});
    this.room.onJoin.add(this.joinListener.bind(this));
  }
 
  render() {
    if (this.state.page === 'wait') return (
      <div>
        <div className="text-center">
          <img align="center" className="center" src={require('../assets/logo.png')} style={{height:150, marginTop: 30}}/>
        </div>
        <h3 align="center" style={{color:'#ccc', marginTop: 50, marginBottom: 30}}>Code({this.state.room}) - Joined Users</h3>
        {this.state.users.map((user, i)=>{
          return (
          <div className="listcontainer" key={i} style={{background:'rgba(255, 255, 255, 0.1)', borderRadius:10, maxWidth:300}}>
            <img className='listimg' src={require('../assets/'+user.avatar)}/><span className='listname'>{user.fname}</span>
          </div>
          )
        })}
      </div>
    )
    if (this.state.page === 'game') return (
      <div className="contentcenter">
        {this.state.users.map((user, i)=>{
          return (
          <div className="gamecontainer" key={i}>
            <div>
              <img className='gameimg' src={require('../assets/'+user.avatar)}/>
              <h6 className='gamename'>{user.fname}</h6>
            </div>
            <p>Score</p>
            <p className="gamescore">{user.tscore}</p>
            <p className="gameicon">{(()=>{
              if (user.score.length < this.state.step) 
                return (<span><i className="fa fa-hourglass-half"></i></span>);
              else if (user.score[this.state.step-1] == 0) 
                return (<span><i className="fa fa-times-circle"></i></span>);
              else return (<span><i className="fa fa-check-circle"></i></span>);
              // user.score[this.state.step-1]?(<span>&nbsp;</span>):(<span className="glyphicon glyphicon-time">&nbsp;</span>)
            })()}</p>
          </div>
          )
        })}
        <h3 align="center" style={{color:'#ccc', marginTop: 50, marginBottom: 30}}>{this.state.step}/5 Questions</h3>
        <h4 align="center" style={{color:'#ccc', marginTop: 10, marginBottom: 30}}>{this.state.question}</h4>
        {this.state.answers.map((answer, i)=>{
          return (
          <div className="answercontainer" key={i} style={{background:'rgba(255, 255, 255, 0.05)', maxWidth:400}}>
            <span className='answername'>{answer}</span>
          </div>
          )
        })}
      </div>
    )
    if (this.state.page === 'result') return (
      <div>
        <div className="text-center">
          <img align="center" className="center" src={require('../assets/logo.png')} style={{height:150, marginTop: 30}}/>
        </div>
        <h3 align="center" style={{color:'#ccc', marginTop: 50, marginBottom: 30}}>Game Result</h3>
        {this.state.users.map((user, i)=>{
          return (
          <div className="listcontainer" key={i} style={{background:'rgba(255, 255, 255, 0.1)', borderRadius:10, maxWidth:300}}>
            <img className='listimg' src={require('../assets/'+user.avatar)}/><span className='listname'>{user.fname}&nbsp;&nbsp;&nbsp;&nbsp;<strong>{user.tscore}</strong></span>
          </div>
          )
        })}
      </div>
    )
    return (
        <div>
          <div className="text-center">
            <img align="center" className="center" src={require('../assets/logo.png')} style={{height:150, marginTop: 30}}/>
          </div>
          <form onSubmit={this.onSubmit} className="text-center" style={{ marginTop: 10 }}>
            <h3 align="center" style={{color:'#ccc', marginTop: 50, marginBottom: 30}}>Please input game code</h3>
            <div className="form-group">
              <input type="text" style={{width:200, padding:10, borderRadius:6, background:'rgba(255, 255, 255, 0.2)', border:0}} value={this.state.room} onChange={this.onChangeCode}/>
            </div>
            <div className="form-group">
              <input type="submit" style={{width:200, padding:10, borderRadius:25, border:'1px solid #ccc', background:'rgba(0, 0, 0, 0)', color:'#ccc'}} value="Start"/>
            </div>
          </form>
        </div>
    )
  }
}