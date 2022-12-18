import { Component } from "react";
import "../index.css";
import Game from "./Game";
import { Nav } from "./Index";
import rouletteTable from "../assets/roulette_table.png";
import slots from "../assets/slots.png";
import blackjack from "../assets/blackjack.png";

class Room extends Component {
  async joinSlots() {
    
  }

  async joinRoulette() {
    
  }

  constructor(props) {
    super(props);
    this.joinRoulette = this.joinRoulette.bind(this);
  }
  render() {
    return (
      <>
        <Nav />
        <div className="playcards__container">          
          <Game name="Slots" image={slots} live={true} join='/slots'/>
          <Game name="Blackjack" image={blackjack} live={true} join='/blackjack'/>
          <Game name="Roulette" image={rouletteTable} live={true} join='/roulette'/>        
        </div>
      </>
    );
  }
}

export default Room;
