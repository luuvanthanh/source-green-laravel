import React, { useRef, useState } from 'react';
import { Modal, Button } from 'antd';
import Draggable from 'react-draggable';
import styles from './style.module.scss';

function Index() {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleCall, setIsVisibleCall] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef();

  const [inputNumber, setInputNumber] = useState('');
  const phoneBtns = [];
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach((item) => {
    phoneBtns.push(
      <Button
        className={styles['phone-button']}
        onClick={(e) => {
          setInputNumber(inputNumber + e.target.value);
        }}
        value={item}
        key={item}
      >
        {item}
      </Button>,
    );
  });

  const showModal = () => {
    setIsVisible(true);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setInputNumber('');
  };

  const callNumber = () => {
    setIsVisible(false);
    setIsVisibleCall(true);
  };

  const handleCancelCall = () => {
    setIsVisibleCall(false);
    setInputNumber('');
  };

  const onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return (
    <>
      <div className={styles['logo-call']} role="presentation" onClick={showModal}>
        <img src="/images/icon/phone.svg" alt="logo-call" />
      </div>

      {/* Phone Modal */}
      <Modal
        className={styles['phone-simulator']}
        visible={isVisible}
        onCancel={handleCancel}
        width={320}
        footer={null}
      >
        <div
          className={styles['show-input']}
          role="presentation"
          onClick={() => setInputNumber(inputNumber.substr(0, inputNumber.length - 1))}
        >
          {inputNumber}
        </div>
        <div className={styles.digits}>{phoneBtns}</div>
        <div className={styles['phone-call']} role="presentation" onClick={callNumber}>
          <img src="/images/icon/phone.svg" alt="phone-call" />
        </div>
      </Modal>

      {/* Call Modal */}
      <Modal
        maskClosable={false}
        footer={null}
        visible={isVisibleCall}
        onCancel={handleCancelCall}
        modalRender={(modal) => (
          <Draggable
            disabled={isDisabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <div
          style={{
            width: '100%',
            cursor: 'move',
            padding: 24,
          }}
          onMouseOver={() => {
            if (isDisabled) setIsDisabled(false);
          }}
          onMouseOut={() => setIsDisabled(true)}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          {inputNumber}
        </div>
      </Modal>
    </>
  );
}

export default Index;
