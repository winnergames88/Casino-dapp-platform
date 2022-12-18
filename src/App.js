import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/Index";
//import Room from "./components/Room";
//import Slots from "./components/Slots/Slots";
import Slotmachine from "./components/Slotmachine/Jackpot"
import Blackjack from "./components/BlackJack/Blackjack";
//import BlackjackGame from "./components/BlackJack2/blackjack";
import Roulette from "./components/Roulette/Roulette"

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Nav />} />
        <Route path="/home" element={<Nav />} />
        <Route path="/slots" element={<Slotmachine />} />
        <Route path="/blackjack" element={<Blackjack />} />
        <Route path="/roulette" element={<Roulette />} />
      </Routes>
    </>
  );
}

export default App;
