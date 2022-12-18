import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userLanguage } from '../connect-db';
import styles from './styles/Controls.module.css';

const Controls = ({ balance, gameState, buttonState, betEvent, hitEvent, standEvent, resetEvent }) => {
  const [amount, setAmount] = useState(1);
  const [inputStyle, setInputStyle] = useState(styles.input);

  useEffect(() => {
    validation();
  }, [amount, balance]);

  const validation = () => {
    if (balance === undefined) {
      setInputStyle(styles.inputError);
      return false;
    }

    if (amount > balance) {
      setInputStyle(styles.inputError);
      return false;
    }
    if (amount < 0.01) {
      setInputStyle(styles.inputError);
      return false;
    }
    setInputStyle(styles.input);
    return true;
  }

  const amountChange = (e) => {
    setAmount(e.target.value);
  }

  const numChecker = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]+$/;
    if (value.match(regex) && Number(value) >= 0 || value==="") {
      setAmount(value);
    }
  }

  const onBetClick = () => {
    if (validation()) {
      betEvent(Math.round(amount * 100) / 100);
    }
  }

  const getControls = () => {
    if (gameState === 0) {
      return (
        <div className={styles.controlsContainer}>
          <div className={styles.betContainer}>
            <h6> {userLanguage?'Amount($):':'金额($):'}</h6>
            <input autoFocus value={amount} onChange={numChecker} className={inputStyle} type="number" />
          </div>
          <button onClick={() => onBetClick()} className={styles.button}>{userLanguage?'Bet':'下注'}</button>
          <Link to='/'><button className={styles.button}>{userLanguage?'Back To Home':'返回首页'}</button></Link>
        </div>
      );
    }
    else {
      return (
        <div className={styles.controlsContainer}>
          <button onClick={() => hitEvent()} disabled={buttonState.hitDisabled} className={styles.button}>{userLanguage?'Hit':'加牌'}</button>
          <button onClick={() => standEvent()} disabled={buttonState.standDisabled} className={styles.button}>{userLanguage?'Stand':'停牌'}</button>
          <button onClick={() => resetEvent()} disabled={buttonState.resetDisabled} className={styles.button}>{userLanguage?'Reset':'重新发牌'}</button>
        </div>
      );
    }
  }

  return (
    <>
      {getControls()}
    </>
  );
}

export default Controls;