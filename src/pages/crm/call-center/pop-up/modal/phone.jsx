import { Button } from 'antd';
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../style.module.scss';
import { handleCallClick } from '../handleCallCenter';
import variablesModule from '../variables';

const Phone = memo(({ handleOnClick, audioRef }) => {
  const [inputNumber, setInputNumber] = useState('');
  const { clientContext } = handleCallClick();

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
      handleOnClick(inputNumber, variablesModule.STATUS.outbound);
      clientContext(inputNumber, audioRef.current);
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
  audioRef: PropTypes.objectOf(PropTypes.any),
};

Phone.defaultProps = {
  handleOnClick: () => {},
  audioRef: {},
};

export default Phone;
