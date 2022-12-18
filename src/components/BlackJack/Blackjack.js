import React, { useState, useEffect } from 'react';
import Status from './Status';
import Controls from './Controls';
import Hand from './Hand';
import jsonData from './deck.json';
//import { appStore } from "../../store/AppStore";
import { userAddress, userBalance, userLanguage, userBet, userWin } from '../connect-db';
import "../../index.css";

const Blackjack = () => {
  const GameState = {
    bet: 0,
    init: 1,
    userTurn: 2,
    dealerTurn: 3
  }

  const Deal = {
    user: 0,
    dealer: 1,
    hidden: 2
  }

  const Message = {
    bet: 'Place a Bet!',
    hitStand: 'Hit or Stand?',
    bust: 'Bust!',
    userWin: 'You Win!',
    dealerWin: 'Dealer Wins!',
    tie: 'Tie!',
    bet_cn: '请下注!',
    hitStand_cn: '加牌或停牌?',
    bust_cn: '爆牌!',
    userWin_cn: '您赢了!',
    dealerWin_cn: '庄家赢!',
    tie_cn: '和局！' 
  }

  const data = JSON.parse(JSON.stringify(jsonData.cards));
  const [deck, setDeck] = useState(data);

  const [userCards, setUserCards] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const [dealerCards, setDealerCards] = useState([]);
  const [dealerScore, setDealerScore] = useState(0);
  const [dealerCount, setDealerCount] = useState(0);

  const [balance, setBalance] = useState(userBalance);
  const [bet, setBet] = useState(0);

  const [gameState, setGameState] = useState(GameState.bet);
  const [message, setMessage] = useState(Message.bet);
  const [buttonState, setButtonState] = useState({
    hitDisabled: false,
    standDisabled: false,
    resetDisabled: true
  });

  //const { score } = appStore;
  //setBalance(userBalance);
  /* if(!userLanguage) {
    setMessage(Message.bet_cn);
  } */

  useEffect(() => {
    if (gameState === GameState.init) {
      drawCard(Deal.user);
      drawCard(Deal.hidden);
      drawCard(Deal.user);
      drawCard(Deal.dealer);
      setGameState(GameState.userTurn);
      
      if(userLanguage) {
        setMessage(Message.hitStand);
      } else {
        setMessage(Message.hitStand_cn);
      }
    } else if(gameState === GameState.bet) {
      if(userLanguage) {
        setMessage(Message.bet);
      } else {
        setMessage(Message.bet_cn);
      }    
    }
  }, [gameState]);

  useEffect(() => {
    calculate(userCards, setUserScore);
    setUserCount(userCount + 1);
  }, [userCards]);

  useEffect(() => {
    calculate(dealerCards, setDealerScore);
    setDealerCount(dealerCount + 1);
  }, [dealerCards]);

  useEffect(() => {
    if (gameState === GameState.userTurn) {
      if (userScore === 21) {
        buttonState.hitDisabled = true;
        setButtonState({ ...buttonState });
      }
      else if (userScore > 21) {
        bust();
      }
    }
  }, [userCount]);

  useEffect(() => {
    if (gameState === GameState.dealerTurn) {
      if (dealerScore >= 17) {
        checkWin();
      }
      else {
        drawCard(Deal.dealer);
      }
    }
  }, [dealerCount]);

  const resetGame = () => {
    console.clear();
    setDeck(data);

    setUserCards([]);
    setUserScore(0);
    setUserCount(0);

    setDealerCards([]);
    setDealerScore(0);
    setDealerCount(0);

    setBet(0);

    setGameState(GameState.bet);
    if(userLanguage) {
      setMessage(Message.bet);
    } else {
      setMessage(Message.bet_cn);
    }

    setButtonState({
      hitDisabled: false,
      standDisabled: false,
      resetDisabled: true
    });
  }

  const placeBet = (amount) => {
    setBet(amount);
    setBalance(Math.round((balance - amount) * 100) / 100);
    //userBalance = userBalance - amount;
    userBet(userAddress, amount, 1, 'bet');
    setGameState(GameState.init);
  }

  const drawCard = (dealType) => {
    if (deck.length > 0) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      const card = deck[randomIndex];
      deck.splice(randomIndex, 1);
      setDeck([...deck]);
      //console.log('Remaining Cards:', deck.length);
      switch (card.suit) {
        case 'spades':
          dealCard(dealType, card.value, '♠');
          break;
        case 'diamonds':
          dealCard(dealType, card.value, '♦');
          break;
        case 'clubs':
          dealCard(dealType, card.value, '♣');
          break;
        case 'hearts':
          dealCard(dealType, card.value, '♥');
          break;
        default:
          break;
      }
    }
    else {
      alert('All cards have been drawn');
    }
  }

  const dealCard = (dealType, value, suit) => {
    switch (dealType) {
      case Deal.user:
        userCards.push({ 'value': value, 'suit': suit, 'hidden': false });
        setUserCards([...userCards]);
        break;
      case Deal.dealer:
        dealerCards.push({ 'value': value, 'suit': suit, 'hidden': false });
        setDealerCards([...dealerCards]);
        break;
      case Deal.hidden:
        dealerCards.push({ 'value': value, 'suit': suit, 'hidden': true });
        setDealerCards([...dealerCards]);
        break;
      default:
        break;
    }
  }

  const revealCard = () => {
    dealerCards.filter((card) => {
      if (card.hidden === true) {
        card.hidden = false;
      }
      return card;
    });
    setDealerCards([...dealerCards])
  }

  const calculate = (cards, setScore) => {
    let total = 0;
    cards.forEach((card) => {
      if (card.hidden === false && card.value !== 'A') {
        switch (card.value) {
          case 'K':
            total += 10;
            break;
          case 'Q':
            total += 10;
            break;
          case 'J':
            total += 10;
            break;
          default:
            total += Number(card.value);
            break;
        }
      }
    });
    const aces = cards.filter((card) => {
      return card.value === 'A';
    });
    aces.forEach((card) => {
      if (card.hidden === false) {
        if ((total + 11) > 21) {
          total += 1;
        }
        else if ((total + 11) === 21) {
          if (aces.length > 1) {
            total += 1;
          }
          else {
            total += 11;
          }
        }
        else {
          total += 11;
        }
      }
    });
    setScore(total);
  }

  const hit = () => {
    drawCard(Deal.user);
  }

  const stand = () => {
    buttonState.hitDisabled = true;
    buttonState.standDisabled = true;
    buttonState.resetDisabled = false;
    setButtonState({ ...buttonState });
    setGameState(GameState.dealerTurn);
    revealCard();
  }

  const bust = () => {
    buttonState.hitDisabled = true;
    buttonState.standDisabled = true;
    buttonState.resetDisabled = false;
    setButtonState({ ...buttonState });
    if(userLanguage) {
      setMessage(Message.bust);
    } else {
      setMessage(Message.bust_cn);
    }
  }

  const checkWin = () => {
    if (userScore > dealerScore || dealerScore > 21) {
      setBalance(Math.round((balance + (bet * 1.95)) * 100) / 100);
      //userBalance = userBalance + bet*2;
      userWin(userAddress, bet * 1.95, bet*0.05, 1, 'win');
      //setMessage('You win '+Number(bet*1.95).toFixed(2)+'$');
      if(userLanguage) {
        setMessage('You win '+Number(bet*1.95).toFixed(2)+'$');
      } else {
        setMessage('您赢了 '+Number(bet*1.95).toFixed(2)+'$');
      }
    }
    else if (dealerScore > userScore) {
      if(userLanguage) {
        setMessage(Message.dealerWin);
      } else {
        setMessage(Message.dealerWin_cn);
      }
    }
    else {
      setBalance(Math.round((balance + (bet * 1)) * 100) / 100);
      //userBalance = userBalance + bet;
      userWin(userAddress, bet, 0, 1, 'tie');

      if(userLanguage) {
        setMessage(Message.tie);
      } else {
         setMessage(Message.tie_cn);
      }
    }
  }

  return (
    <>
      <div className="blackjack__container">
        <Status message={message} balance={balance} />
        <Controls
          balance={balance}
          gameState={gameState}
          buttonState={buttonState}
          betEvent={placeBet}
          hitEvent={hit}
          standEvent={stand}
          resetEvent={resetGame}
        />
        <Hand title={userLanguage?`Dealer's Hand (${dealerScore})`:`庄家手牌 (${dealerScore})`} cards={dealerCards} />
        <Hand title={userLanguage?`Your Hand (${userScore})`:`您的手牌 (${userScore})`} cards={userCards} />
      </div>
    </>
  );
}

export default Blackjack;
