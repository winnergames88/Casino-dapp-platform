import React, { useState, useEffect } from 'react'
import { userAddress, userBalance, userLanguage, slotJackpot, userBet, userWin, 
    slotProbability1,slotProbability2,slotProbability3,slotMaxProbability, slotMul1, 
    slotMul2, slotMul3, updateJackpot } from '../connect-db'
import { Link } from 'react-router-dom'
import img1 from './img/1.jpg'
import img2 from './img/2.jpg'
import img3 from './img/3.jpg'
import img4 from './img/4.jpg'
import img5 from './img/5.jpg'
import img6 from './img/6.jpg'
import './jackpot.css'


const Jackpot = ({ id, owned, close, expires }) => {

    const [spin, setSpin] = useState(false)
    const [ring1, setRing1] = useState()
    const [ring2, setRing2] = useState()
    const [ring3, setRing3] = useState()
    const [price, setPrice] = useState()
    const [input, setInput] = useState(1)
    const [realBet, setRealBet] = useState()
    const [jackpot, setJackpot] = useState(slotJackpot)
    const [balance, setBalance] = useState(userBalance)


    useEffect(() => {
        win()
    }, [ring3])


    function row1() {

        if (!spin) {
            return (
                <>
                    <img src={img1} className="ringEnd" />
                    <img src={img2} className="ringEnd" />
                    <img src={img3} className="ringEnd" />
                    <img src={img4} className="ringEnd" />
                </>
            )
        } else if (spin && ring1 === undefined) {
            return (
                <>
                    <img src={img1} className="ringMoving" />
                    <img src={img2} className="ringMoving" />
                    <img src={img3} className="ringMoving" />
                    <img src={img4} className="ringMoving" />

                </>
            )
        } else if (ring1 >= 1 && ring1 <= slotProbability1) {
            return (
                <>
                    <img src={img1} className="ringEnd" />
                    <img src={img2} className="ringEnd" />
                    <img src={img3} className="ringEnd" />
                    <img src={img4} className="ringEnd" />
                </>
            )
        } else if (ring1 > slotProbability1 && ring1 <= slotProbability2) {
            return (
                <>
                    <img src={img2} className="ringEnd" />
                    <img src={img1} className="ringEnd" />
                    <img src={img3} className="ringEnd" />
                    <img src={img4} className="ringEnd" />
                </>
            )
        } else if (ring1 > slotProbability2 && ring1 <= slotProbability3) {
            return (
                <>
                    <img src={img1} className="ringEnd" />
                    <img src={img3} className="ringEnd" />
                    <img src={img2} className="ringEnd" />
                    <img src={img4} className="ringEnd" />
                </>
            )
        } else if (ring1 > slotProbability3 && ring1 <= slotMaxProbability) {
            return (
                <>
                    <img src={img2} className="ringEnd" />
                    <img src={img4} className="ringEnd" />
                    <img src={img3} className="ringEnd" />
                    <img src={img1} className="ringEnd" />
                </>
            )
        }
    }

    function row2() {

        if (!spin) {
            return (
                <>
                    <img src={img4} className="ringEnd" />
                    <img src={img2} className="ringEnd" />
                    <img src={img3} className="ringEnd" />
                    <img src={img1} className="ringEnd" />
                </>
            )
        } else if (spin && ring2 === undefined) {
            return (
                <>
                    <img src={img4} className="ringMoving" />
                    <img src={img2} className="ringMoving" />
                    <img src={img3} className="ringMoving" />
                    <img src={img1} className="ringMoving" />
                </>
            )
        } else if (ring2 >= 1 && ring2 <= slotProbability1) {
            return (
                <>
                    <img src={img4} className="ringEnd" />
                    <img src={img2} className="ringEnd" />
                    <img src={img3} className="ringEnd" />
                    <img src={img1} className="ringEnd" />
                </>
            )
        } else if (ring2 > slotProbability1 && ring2 <= slotProbability2) {
            return (
                <>
                    <img src={img2} className="ringEnd" />
                    <img src={img1} className="ringEnd" />
                    <img src={img3} className="ringEnd" />
                    <img src={img4} className="ringEnd" />
                </>
            )
        } else if (ring2 > slotProbability2 && ring2 <= slotProbability3) {
            return (
                <>
                    <img src={img1} className="ringEnd" />
                    <img src={img3} className="ringEnd" />
                    <img src={img2} className="ringEnd" />
                    <img src={img4} className="ringEnd" />
                </>
            )
        } else if (ring2 > slotProbability3 && ring2 <= slotMaxProbability) {
            return (
                <>
                    <img src={img1} className="ringEnd" />
                    <img src={img4} className="ringEnd" />
                    <img src={img2} className="ringEnd" />
                    <img src={img3} className="ringEnd" />
                </>
            )
        }

    }

    function row3() {

        if (!spin) {
            return (
                <>
                    <img src={img1} className="ringEnd" />
                    <img src={img2} className="ringEnd" />
                    <img src={img4} className="ringEnd" />
                    <img src={img3} className="ringEnd" />
                </>
            )
        } else if (spin && ring3 === undefined) {
            return (
                <>
                    <img src={img2} className="ringMoving" />
                    <img src={img4} className="ringMoving" />
                    <img src={img3} className="ringMoving" />
                    <img src={img1} className="ringMoving" />
                    <img src={img5} className="ringMoving" />
                    <img src={img6} className="ringMoving" />
                </>
            )
        } else if (ring3 >= 1 && ring3 <= slotProbability1) {
            return (
                <>
                    <img src={img3} className="ringEnd" />
                    <img src={img2} className="ringEnd" />
                    <img src={img4} className="ringEnd" />
                    <img src={img1} className="ringEnd" />
                </>
            )
        } else if (ring3 > slotProbability1 && ring3 <= slotProbability2) {
            return (
                <>
                    <img src={img2} className="ringEnd" />
                    <img src={img1} className="ringEnd" />
                    <img src={img3} className="ringEnd" />
                    <img src={img4} className="ringEnd" />
                </>
            )
        } else if (ring3 > slotProbability2 && ring3 <= slotProbability3) {
            return (
                <>
                    <img src={img2} className="ringEnd" />
                    <img src={img3} className="ringEnd" />
                    <img src={img1} className="ringEnd" />
                    <img src={img4} className="ringEnd" />
                </>
            )
        } else if (ring3 > slotProbability3 && ring3 <= slotMaxProbability) {
            return (
                <>
                    <img src={img3} className="ringEnd" />
                    <img src={img4} className="ringEnd" />
                    <img src={img1} className="ringEnd" />
                    <img src={img2} className="ringEnd" />
                </>
            )
        }
    }

    function win() {
        if (ring1 <= slotProbability1 && ring2 <= slotProbability1 && ring3 <= slotProbability1 && ring1 !== undefined) {
            setPrice(1)
        } else if (ring1 > slotProbability1 && ring1 <= slotProbability2 && 
                   ring2 > slotProbability1 && ring2 <= slotProbability2 && 
                   ring3 > slotProbability1 && ring3 <= slotProbability2 && ring1 !== undefined) {
            setPrice(2)
        } else if (ring1 > slotProbability2 && ring1 <= slotProbability3 && 
                   ring2 > slotProbability2 && ring2 <= slotProbability3 && 
                   ring3 > slotProbability2 && ring3 <= slotProbability3 && ring1 !== undefined) {
            setPrice(3)
        } else if (ring1 > slotProbability3 && ring1 <= slotMaxProbability && 
                   ring2 > slotProbability3 && ring2 <= slotMaxProbability && 
                   ring3 > slotProbability3 && ring3 <= slotMaxProbability && ring1 !== undefined) {
            setPrice(4)
        } else {
            setPrice(0)
        }
    }

    function rand() {
        setRing1(Math.floor(Math.random() * (slotMaxProbability - 1) + 1))
        setTimeout(function () { setRing2(Math.floor(Math.random() * (slotMaxProbability - 1) + 1)) }, 1000)
        setTimeout(function () { setRing3(Math.floor(Math.random() * (slotMaxProbability - 1) + 1)) }, 2000)
    }

    function play() {
        if (ring3 > 1 || !spin) {
            if (input <= balance && input >= 1) {
                setRealBet(input)
                setSpin(true)
                setRing1()
                setRing2()
                setRing3()
                setBalance(balance - input)
                setJackpot(jackpot + (input / 2))
                userBet(userAddress, input, 2, 'bet')
                setTimeout(function () {
                    rand()
                }, 2000)
            } else {
                setPrice(10)
            }

        }
    }


    function win() {
        if (ring1 <= slotProbability1 && ring2 <= slotProbability1 && ring3 <= slotProbability1 && ring1 !== undefined) {
            setPrice(1)
            setBalance(balance + (realBet * slotMul1 * 0.95))
            userWin(userAddress,  realBet * slotMul1 * 0.95, realBet * slotMul1 *0.05, 2, 'win')
        } else if (ring1 > slotProbability1 && ring1 <= slotProbability2 && 
                   ring2 > slotProbability1 && ring2 <= slotProbability2 && 
                   ring3 > slotProbability1 && ring3 <= slotProbability2 && ring1 !== undefined) {
            setPrice(2)
            setBalance(balance + (realBet * slotMul2 * 0.95))
            userWin(userAddress,  realBet * slotMul2 * 0.95, realBet * slotMul2 *0.05, 2, 'win')
        } else if (ring1 > slotProbability2 && ring1 <= slotProbability3 && 
                   ring2 > slotProbability2 && ring2 <= slotProbability3 && 
                   ring3 > slotProbability2 && ring3 <= slotProbability3 && ring1 !== undefined) {
            setPrice(3)
            setBalance(balance + (realBet * slotMul3 * 0.95))
            userWin(userAddress,  realBet * slotMul3 * 0.95, realBet * slotMul3 *0.05, 2, 'win')
        } else if (ring1 > slotProbability3 && ring1 <= slotMaxProbability && 
                   ring2 > slotProbability3 && ring2 <= slotMaxProbability && 
                   ring3 > slotProbability3 && ring3 <= slotMaxProbability && ring1 !== undefined) {
            setPrice(4)
            setBalance(balance + jackpot * 0.95)
            setJackpot(0)
            userWin(userAddress,  jackpot * 0.95, jackpot *0.05, 2, 'win')
            updateJackpot(0, 2)
        } else {
            setPrice(0)
        }
    }

    function premio() {
        if (price === 1 && ring3 > 1) {
            return (
                <p className="priceInd">{"X" + (slotMul1) + (userLanguage?" You've won ":" 您赢了 ") + (realBet * slotMul1 * 0.95) + "$!"}</p>
            )
        } else if (price === 2 && ring3 > 1) {
            return (
                <p className="priceInd">{"X" + (slotMul2) + (userLanguage?" You've won ":" 您赢了 ") + (realBet * slotMul2 * 0.95) + "$!"}</p>
            )
        } else if (price === 3 && ring3 > 1) {
            return (
                <p className="priceInd">{"X" + (slotMul3) +(userLanguage?" You've won ":" 您赢了 ") + (realBet * slotMul3 * 0.95) + "$!"}</p>
            )
        } else if (price === 4 && ring3 > 1) {
            return (
                <p className="priceInd">{(userLanguage?"Jackpot! You've won ":"大奖! 您赢了 ") + (jackpot * 0.95) + "$!"}</p>
            )
        } else if (price === 0 && ring3 > 1) {
            return (
                <p className="priceInd">😧{userLanguage?'So close! But no luck...':'很接近了！但运气不好...'}</p>
            )
        } else if (price === 10) {
            return (
                <p className="priceInd">🥶 <span style={{ color: `red` }}>{userLanguage?'Not enough funds':'余额不足'}</span> </p>
            )
        }
    }

    function numChecker(e) {
        const value = e.target.value;
        const regex = /^[0-9]+$/;
        if (value.match(regex) && parseInt(value) >= 0) {
            setInput(value);
        }
    }

    return (
        <div className="fullSlot">            
            <h1 className="price">{(userLanguage?"Jackpot: ":"大奖: ") + jackpot + "$"}</h1>
            <div className="slot">
                <div className="row__jp">
                    {row1()}
                </div>
                <div className="row__jp">
                    {row2()}
                </div>
                <div className="row__jp">
                    {row3()}
                </div>
            </div>
            <h1 className="price">
                {premio()}
            </h1>
            <div className="slotFoot">
                <input value={input} type="number" onChange={(e) => numChecker(e)} className="betInput" placeholder="0$"></input>
                <button className="spinButton" onClick={() => play()}>{userLanguage?'Spin':'下注'}</button>
            </div>
            <h1 className="price">{(userLanguage?"Balance: ":"余额: ") + Math.round((balance * 100)) / 100 + "$"}</h1>
            <Link to='/'><button className="buyMoreButton">{userLanguage?'Back To Home':'返回首页'}</button></Link>
        </div>

    )
}

export default Jackpot;