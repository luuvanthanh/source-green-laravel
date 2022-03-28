import { Button } from 'antd';
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../style.module.scss';
import variablesModule from '../variables';

const Phone = memo(({ handleOnClick }) => {
  const [inputNumber, setInputNumber] = useState('');

  const phoneBtns = [];
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach((item) => {
    phoneBtns.push(
      <Button
        className={styles['phone-button']}
        onClick={(e) => {
          if (inputNumber.length < 12) {
            setInputNumber(inputNumber + e.target.value);
          }
        }}
        value={item}
        key={item}
      >
        {item}
      </Button>,
    );
  });

  const callNumber = () => {
    if (handleOnClick) {
      handleOnClick(variablesModule.STATUS.outbound, inputNumber);
    }
  };

  return (
    <>
      <div className={styles['show-input']}>{inputNumber}</div>
      <div className={styles.digits}>{phoneBtns}</div>
      <div className={styles['button-group']}>
        <div className={styles['button-item']}> </div>
        <div className={styles['button-item']}>
          <div className={styles['phone-call']} role="presentation" onClick={callNumber}>
            <img src="/images/icon/phone.svg" alt="phone-call" />
          </div>
        </div>
        <div className={styles['button-item']}>
          <div
            className={styles['delete-number']}
            role="presentation"
            onClick={() => setInputNumber(inputNumber.substr(0, inputNumber.length - 1))}
          >
            <img src="/images/icon/delete.svg" alt="delete-number" />
          </div>
        </div>
      </div>
    </>
  );
});

Phone.propTypes = {
  handleOnClick: PropTypes.func,
};

Phone.defaultProps = {
  handleOnClick: () => {},
};

export default Phone;
