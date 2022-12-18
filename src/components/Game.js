import { Component } from "react";
import { Link } from 'react-router-dom';
import "../index.css";
import {userLanguage} from './connect-db';

class Game extends Component {
  render() {
    return (
      <div className={`gamecard ${this.props.live ? "" : "coming_soon"}`}>
        <h1 style={{color: '#000000'}}> {this.props.name} </h1>
        <img src={this.props.image} alt={this.props.name} />
        <Link to={this.props.join}>
          <button className="gamecard__btn">
            {" "}
            {userLanguage?'Join':'进入'}{" "}
          </button>
        </Link>
      </div>
    );
  }
}

export default Game;
