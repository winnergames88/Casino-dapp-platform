import React from 'react';
import './Roulette.css';

import Weel from './components/weel/Weel';
import RouletteTable from './components/table/Table';
import { Container, Row, Col, Image, InputGroup, Form, Button } from 'react-bootstrap';
import { GiDiamonds } from 'react-icons/gi';

import firstRow from './components/table/rows/FirstRow.json';
import firstBorder from './components/table/rows/FirstBorder.json';
import secondRow from './components/table/rows/SecondRow.json';
import secondBorder from './components/table/rows/SecondBorder.json';
import thirdRow from './components/table/rows/ThirdRow.json';
import thirdBorder from './components/table/rows/ThirdBorder.json';
import fourthRow from './components/table/rows/FourthRow.json';
import fifthRow from './components/table/rows/FifthRow.json';
import columnLeft from './components/table/rows/ColumnLeft.json';
import columnRight from './components/table/rows/ColumnRight.json';

import { Link } from 'react-router-dom';
import { userAddress, userBalance, userLanguage, userBet, userWin } from '../connect-db';


class Roulette extends React.Component {

  state = {
    num: "", //winning number
    arr: [], //array of bets
    count: 0, //spins count
    wins: 0, //wins count
    chip: 1, //chip value
    coins: 0, //coins count
    losses: 0, //losses count
    spinning: false, //the wheel is spinning?
    message: "Put your bets and spin the wheel!", //message
    extArr: [], //little trick: pushing number here if user win, so if it's empty, user loose
    winArr: [], //history win number
    lastArr: [], //last array of bets
    lastChip: 0,
    //my JSON rows
    firstRow, firstBorder, secondRow, secondBorder, thirdRow, thirdBorder, fourthRow, fifthRow, columnLeft, columnRight
  }

  //declaring here all the combinations, easier this way
  twoByOneFirst = ["3", "6", "2", "12", "15", "18", "21", "24", "27", "30", "33", "36"];
  twoByOneSecond = ["2", "5", "8", "11", "14", "17", "20", "23", "26", "29", "32", "35"];
  twoByOneThird = ["1", "4", "7", "10", "13", "16", "19", "22", "25", "28", "31", "34"];
  firstTwelves = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  secondTwelves = ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];
  thirdTwelves = ["25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36"];
  oneToEighteen = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"];
  nineteenToThirtySix = ["19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36"];
  black = ["2", "4", "6", "8", "10", "11", "13", "15", "17", "20", "22", "24", "26", "28", "29", "31", "33", "35"];
  red = ['1', '3', '5', '7', '9', '12', '14', '16', '18', '19', '21', '23', '25', '27', '30', '32', '34', '36'];
  even = ["2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22", "24", "26", "28", "30", "32", "34", "36"];
  odd = ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23', '25', '27', '29', '31', '33', '35'];

  constructor(props) {
    super(props);
    this.state.coins = userBalance;
  }

  componentDidMount() {
    //grab here user data from database and set state with that data
  }
  
  isSpinning = (isspinning) => {
    isspinning === true ? this.setState({spinning: true}) : this.setState({spinning: false})
  }

  //handling losing
  userLost = () => {
    //update state for message and losses 
    let msg;
    let losscount;
    if(this.state.winArr.length < 1) {
      if(userLanguage) {
        msg = 'Put your bets on the table above and spin the wheel!';
      } else {
        msg = '请在上方桌面下注并旋转轮盘!';
      };

      losscount = 0;
      this.setState({count: 0});
    } else {
      if(userLanguage) {
        msg = 'No luck this time!';
      } else {
        msg = '这次运气不好!';
      };

      losscount = this.state.losses + 1;
    }

    this.setState({
      message: `${msg}`,
      //losses: this.state.losses + 1,
      losses: losscount,
    }, () => {
      //creating the object to send to mongodb and putting in callback to make sure the state is updated before sending data to database
     

      //and reseting the game
      //console.log("lost resetgame");
      this.resetGame();
    });

  }

  //handling winning

  //passing multiplier to calcolate how much our user win
  userWinGame = (multi) => {
    //updating state for message, wins and coins
    console.log("win multi: ", multi);
    let winAmount;
    let winTax;
    if(multi > this.state.arr.length) {
      winAmount = this.state.arr.length*Number(this.state.chip) + (multi-this.state.arr.length)*Number(this.state.chip)*0.95;
      winTax = (multi-this.state.arr.length)*Number(this.state.chip)*0.05;
    } else {
      winAmount = multi * Number(this.state.chip);
      winTax = 0;
    }

    let msg;
    if(userLanguage) {
      msg = `You win ${Number(winAmount).toFixed(2)}$!`;
    } else {
      msg = `您赢了 ${Number(winAmount).toFixed(2)}$!`;
    };

    this.setState({
      //message: `You win ${multi * Number(this.state.chip)} coins!`,
      //message: `You win ${Number(winAmount).toFixed(2)} coins!`,
      message: `${msg}`,
      wins: this.state.wins + 1,
      //coins: this.state.coins + (multi * Number(this.state.chip))
      coins: this.state.coins + winAmount
    }, () => {
      //creating the object to send to mongodb and putting in callback to make sure the state is updated before sending data to database
      //userWin(userAddress, multi * Number(this.state.chip) ,0, 3, 'win '+this.state.num);
      userWin(userAddress, winAmount, winTax, 3, 'win '+this.state.num);

      //and reseting the game
      this.resetGame();
    });


  }

  //reset game function: emtying the array and setting all the chips to invisible state
  resetGame = () => {
    this.setState({
      lastArr: this.state.arr,
      lastChip: this.state.chip,
      arr: [],
      spinning: false,
      num: "",
      firstRow: firstRow.map(num => {
        num.visible = false;
        num.bet = 0;
        return num;
      }),
      firstBorder: firstBorder.map(num => {
        num.visible = false;
        num.bet = 0;
        return num;
      }),
      secondRow: secondRow.map(num => {
        num.visible = false;
        num.bet = 0;
        return num;
      }),
      secondBorder: secondBorder.map(num => {
        num.visible = false;
        num.bet = 0;
        return num;
      }),
      thirdRow: thirdRow.map(num => {
        num.visible = false;
        num.bet = 0;
        return num;
      }),
      thirdBorder: thirdBorder.map(num => {
        num.visible = false;
        num.bet = 0;
        return num;
      }),
      fourthRow: fourthRow.map(num => {
        num.visible = false;
        num.bet = 0;
        return num;
      }),
      fifthRow: fifthRow.map(num => {
        num.visible = false;
        num.bet = 0;
        return num;
      }),
      columnLeft: columnLeft.map(num => {
        num.visible = false;
        num.bet = 0;
        return num;
      }),
      columnRight: columnRight.map(num => {
        num.visible = false;
        num.bet = 0;
        return num;
      })
    });
  }

  cancelBet = () => {
    this.setState({ coins: this.state.coins + (this.state.arr.length*this.state.chip)});
    userWin(userAddress, Number(this.state.arr.length*this.state.chip) ,0, 3, 'cancelbet');
    this.resetGame();
  }

  //finding out if winning number is in any of the arrays
  determineValidBets = (length, element, num, multiplier) => {
    let extArr = [...this.state.extArr];
    let lunghezza = element.length;
    if (lunghezza === length) {
      let filtering = element.filter(isItMyNum => isItMyNum == num);
      if (filtering == num) {
        extArr.push(num);
        this.setState({ extArr });
        //this.userWinGame(multiplier);
        //console.log(this.state.extArr);
        return true;
      }
    }
  }

  //little different here, checking by name and not the length of the array
  determineValidBetsColFive = (name, element, arrName, num, multiplier) => {
    let extArr = [...this.state.extArr]; 
    if (element === name) {
      let filtered = arrName.filter(item => item == num);
      if (filtered == num) {
        //console.log("name: ",name);
        //console.log("element: ", element);
        //console.log("num: ", num);
        //console.log("arr: ", arrName);
        extArr.push(num);
        this.setState({ extArr })
        //this.userWinGame(multiplier)
        return true;
      }
    }
  }

  //gonna pass this function as props to my Weel.js, so i can update it back with the winning number and determine if user won or loose
  updateNum = (num) => {

    this.setState({ num, count: this.state.count + 1 }); //i'm getting number, that's one spin, updating state with this info
    let winArr = [...this.state.winArr];
    winArr.push(num);
    this.setState({ winArr });
    //map the array of bets
    let mul = 0;
    this.state.arr.map(item => {

      if (item === num) { //if it's just a single number
        //this.userWinGame(35); //multiplier is 35, user win a bunch of coins
        mul += 35;
      }

      //here gonna filter the mini-arrays (borders, columns etc.) and see if winner number is present in any of them

      //if item is not string, means it's an array, so i am going to map it in my determineValidBets function
      if (typeof item !== "string") {

        if(this.determineValidBets(2, item, num, 17)) {mul += 17}
        if(this.determineValidBets(3, item, num, 11)) {mul += 11}
        if(this.determineValidBets(4, item, num, 8)) {mul += 8}
        if(this.determineValidBets(6, item, num, 5)) {mul += 5}
        //otherwise it's a string (even, odd etc), so before mapping i have to check if the element name is in my array and then map that element
      } else {
        if(this.determineValidBetsColFive("Even", item, this.even, num, 2)) {mul += 2}
        if(this.determineValidBetsColFive("Odd", item, this.odd, num, 2)) {mul += 2}
        if(this.determineValidBetsColFive("Black", item, this.black, num, 2)) {mul += 2}
        if(this.determineValidBetsColFive("Red", item, this.red, num, 2)) {mul += 2}
        if(this.determineValidBetsColFive("1 to 18", item, this.oneToEighteen, num, 2)) {mul += 2}
        if(this.determineValidBetsColFive("19 to 36", item, this.nineteenToThirtySix, num, 2)) {mul += 2}
        if(this.determineValidBetsColFive("3rd 12", item, this.thirdTwelves, num, 3)) {mul += 3}
        if(this.determineValidBetsColFive("2nd 12", item, this.secondTwelves, num, 3)) {mul += 3}
        if(this.determineValidBetsColFive("1st 12", item, this.firstTwelves, num, 3)) {mul += 3}
        if(this.determineValidBetsColFive("2:1:1", item, this.twoByOneFirst, num, 3)) {mul += 3}
        if(this.determineValidBetsColFive("2:1:2", item, this.twoByOneSecond, num, 3)) {mul += 3}
        if(this.determineValidBetsColFive("2:1:3", item, this.twoByOneThird, num, 3)) {mul += 3}
      }
    });

    //if there is nothing in existing numbers array, means user lost, firing the respective function
    //if (this.state.extArr.length === 0) {
    if(mul === 0) {
      this.userLost();
    } else {
      this.userWinGame(mul);
    }
  }

  //gonna pass this function as props to my Table.js, so i can update it back
  updateArr = (arr) => {
    this.setState({ arr })
  }

  //gonna pass this function as props to my Table.js, so i can update it back
  updateCoins = (coins) => {
    this.setState({ coins })
  }

  //gonna pass this function as props to my Table.js, so i can update it back
  updateRow = (row, val) => {
    this.setState({ [row]: val })
  }

  updateMessage = (message) => {
    this.setState({ message })
  }

  repeatBet = () => {
    let row;
    let findrow;
    let whichRow;
    let betAmount;

    if(this.state.lastArr.length < 1){
      if(userLanguage) {
        this.updateMessage("No last bet!");
      } else {
        this.updateMessage("没有上次下注!");   
      }
      return;
    }

    if(this.state.arr.length > 0){
      
      if(userLanguage) {
        this.updateMessage("New bet begun,reset first!");
      } else {
        this.updateMessage("本次下注已开始,请先重置!");   
      }
      return;
    }

    if( this.state.coins >= this.state.lastArr.length*this.state.lastChip){
      this.setState({
        arr: this.state.lastArr,
        chip: this.state.lastChip
      });

      this.state.lastArr.map(item => {
        findrow = this.state.firstRow.map(num => {
          if(num.n === item){
            whichRow = 'firstRow';
          }
          return num;
        });
        findrow = this.state.firstBorder.map(num => {
          if(num.n === item){
            whichRow = 'firstBorder';
          }
          return num;
        });
        findrow = this.state.secondRow.map(num => {
          if(num.n === item){
            whichRow = 'secondRow';
          }
          return num;
        });
        findrow = this.state.secondBorder.map(num => {
          if(num.n === item){
            whichRow = 'secondBorder';
            //row = this.state.secondBorder;
          }
          return num;
        });
        findrow = this.state.thirdRow.map(num => {
          if(num.n === item){
            whichRow = 'thirdRow';
            //row = this.state.thirdRow;
          }
          return num;
        });
        findrow = this.state.thirdBorder.map(num => {
          if(num.n === item){
            whichRow = 'thirdBorder';
            //row = this.state.thirdBorder;
          }
          return num;
        });
        findrow = this.state.fourthRow.map(num => {
          if(num.n === item){
            whichRow = 'fourthRow';
            //row = this.state.fourthRow;
          }
          return num;
        });
        findrow = this.state.fifthRow.map(num => {
          if(num.n === item){
            whichRow = 'fifthRow';
            //row = this.state.fifthRow;
          }
          return num;
        });
        findrow = this.state.columnLeft.map(num => {
          if(num.n === item){
            whichRow = 'columnLeft';
            //row = this.state.columnLeft;
          }
          return num;
        });
        findrow = this.state.columnRight.map(num => {
          if(num.n === item){
            whichRow = 'columnRight';
            //row = this.state.columnRight;
          }
          return num;
        })
        
        row = [...this.state[whichRow]];

        //console.log("repeat bet num: ", item);
        
        //tricky part inverted: map each of the rows and check if chip is vivible, if it is NOT, add it
        let updatedRow = row.map(chip => {
          if (chip.n == item) {
            chip.visible = true;
            betAmount = parseInt(chip.bet)+parseInt(this.state.lastChip);
            chip.bet = betAmount;
          }
          return chip;
        });
        //console.log("row: ", whichRow);
        this.setState({ [whichRow]: updatedRow }); //setting the new state with added chips to the rows

        //passing back to Roulette.js updated coins count
        //console.log("repeatbet chip: ", this.state.lastChip);
        userBet(userAddress, this.state.lastChip, 3, 'repeatbet ' + item); 
      });
      this.setState({ coins: this.state.coins - this.state.lastChip*this.state.lastArr.length });
    } else {
      if(userLanguage){
        this.updateMessage("Not enough funds!");
      } else {
        this.updateMessage("余额不足!");
      }
    }
  }

  numChecker = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]+$/;
    if (value.match(regex) && Number(value) >= 0 && this.state.arr.length < 1) {
        this.setState({ chip: value});
    }
  }

  render() {
    return (
      <Container>
        <Row className="justify-items-center pt-2">
          <Container fluid className="table">
            <Row>
              <Col className="mx-5">
                <RouletteTable
                  //ROWS//
                  firstRow={this.state.firstRow}
                  firstBorder={this.state.firstBorder}
                  secondRow={this.state.secondRow}
                  secondBorder={this.state.secondBorder}
                  thirdRow={this.state.thirdRow}
                  thirdBorder={this.state.thirdBorder}
                  fourthRow={this.state.fourthRow}
                  fifthRow={this.state.fifthRow}
                  columnLeft={this.state.columnLeft}
                  columnRight={this.state.columnRight}
                  //END ROWS//
                  updateRow={this.updateRow}
                  updateArr={this.updateArr}
                  updateCoins={this.updateCoins}
                  updateMessage={this.updateMessage}
                  num={this.state.num}
                  arr={this.state.arr}
                  count={this.state.count}
                  coins={this.state.coins}
                  chip={this.state.chip}
                  spinning={this.state.spinning}
                />
                <Row className="bg-red bg-verdict align-items-center">
                  <Col md={4} className="d-flex align-items-center coins-col justify-content-center">
                    <h4 className="m-0">${this.state.coins.toFixed(2)}</h4>
                  </Col>
                  <Col md={8}>
                    <div className="text-center">
                      <h6 className="text-uppercase">{this.state.message}</h6>
                    </div>
                    <div className="text-center">
                      {/* <h6>Your bets: <span>{this.state.arr.join(", ")}</span></h6> */}
                      <div className="divider-line divider-line-center divider-line-linear-gradient w-100 mx-auto my-4">
                        <GiDiamonds className="diamond-line-icon" />
                      </div>
                      <ul className="list-inline">
                        <li className="list-inline-item">{userLanguage?'Spins:':'旋转:'} {this.state.count}</li>
                        <li className="list-inline-item">{userLanguage?'Wins:':'赢:'} {this.state.wins}</li>
                        <li className="list-inline-item">{userLanguage?'Losses:':'输'} {this.state.losses}</li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col className="align-self-center">
                <Weel
                  isSpinning={this.isSpinning}
                  updateNum={this.updateNum}
                  num={this.state.num}
                  arr={this.state.arr}
                  count={this.state.count}
                  spinning={this.state.spinning}
                />
              </Col>
            </Row>
          </Container>
          <Container fluid className="table">              
            <Row>            
              <Col md={2}>               
                <InputGroup className="mb-2">
                  <InputGroup.Text className='custom-btn'>{userLanguage?'CHIP:':'筹码:'}</InputGroup.Text>
                  <Form.Control value={this.state.chip} onChange={(e) => this.numChecker(e)} type="number" placeholder="0$"/>
                  <InputGroup.Text className='custom-btn'>$</InputGroup.Text>
                </InputGroup>
              </Col>
              <Col className="text-light-gold">
                &nbsp;{userLanguage?'Your bets:':'本次投注:'} {this.state.arr.join(", ")}                
              </Col>
              <Col className="text-light-gold">
                &nbsp;{userLanguage?'Last bets:':'上次投注:'} {this.state.lastArr.join(", ")}                
              </Col>
              <Col md={1.5}>
                <Button className='custom-btn' onClick={this.repeatBet} disabled={this.state.spinning || this.state.arr.length>0 || this.state.lastArr.length<1}>{userLanguage?'Repeat':'重复'}</Button>
              </Col>
              <Col md={1.5}>
                <Button className='custom-btn' onClick={this.cancelBet} disabled={this.state.spinning}>{userLanguage?'Reset':'重置'}</Button>
              </Col>
              <Col md={2}>
                <Link to='/'><Button className='custom-btn'>{userLanguage?'Back To Home':'返回首页'}</Button></Link>
              </Col>
            </Row>   
            <Row>
              <Col className="text-gold">
                {userLanguage?'History Win Number:':'历史开奖号码:'} {this.state.winArr.join(", ")}
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
    )
  }
}

export default Roulette;



  //STILL NEED TO CREATE FUNCTIONALITY FOR 

  //Basket, or a five number bet, and allows players to bet on the zero, double zero, 1, 2, and 3. Payout – 6:1.

