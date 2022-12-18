import React from 'react';
import styles from './styles/Card.module.css';

const Card = ({ value, suit, hidden }) => {
  const getColor = () => {
    if (suit === '♠' || suit === '♣') {
      return styles.black;
    }
    else {
      return styles.red;
    }
  }

  const getCard = () => {
    if (hidden) {
      return (
        <div className={styles.hiddenCard} />
      );
    }
    else {
      return (
        <div className={styles.card}>
          <div className={getColor()}>
            <h1 className={styles.value}>{value}</h1>
            <h1 className={styles.suit}>{suit}</h1>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      {getCard()}
    </>
  );
}

export default Card;