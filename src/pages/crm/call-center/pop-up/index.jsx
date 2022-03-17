import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'antd';
// import ButtonCus from '@/components/CommonComponent/Button';
// import FormItem from '@/components/CommonComponent/FormItem';
import Draggable from 'react-draggable';
import classnames from 'classnames';
// import { variables } from '@/utils';
import Timer from 'react-timer-wrapper';
import Timecode from 'react-timecode';
import { isEmpty } from 'lodash';
import styles from './style.module.scss';
import {
  handlePageLoad,
  handleCallClick,
  handleHangup,
  handleAnswer,
  handleReject,
} from './handleCallCenter';

const STATUS = {
  idle: 'IDLE',
  inbound: 'INBOUND',
  outbound: 'OUTBOUND',

  accepted: 'ACCEPTED',
  rejected: 'REJECTED',
  cancel: 'CANCEL',
  bye: 'BYE',
  failed: 'FAILED',
  unavailable: 'UNAVAILABLE',
  not_found: 'NOTFOUND',
};

function Index() {
  const [inputNumber, setInputNumber] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleAddLead, setVisibleAddLead] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [statusCall, setStatusCall] = useState(STATUS.idle);
  const [clientNumber, setClientNumber] = useState('');
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef();
  const audioRef = useRef();

  const SERVER_INFO = {
    username: '23328',
    // username: '23359',
    password: 'crm@cmc2018',
    hostname: 'kam-01.api-connect.io',
    port: '7443',
    path: '',
  };

  const { sessionStatus, infoCall } = handlePageLoad(
    SERVER_INFO.username,
    SERVER_INFO.password,
    SERVER_INFO.hostname,
    SERVER_INFO.port,
    SERVER_INFO.path,
    audioRef.current,
  );
  const [clientStatus, performCall] = handleCallClick();
  const [clientStatusCall, setClientStatusCall] = useState('');

  useEffect(() => {
    if (!isEmpty(infoCall)) {
      setStatusCall(STATUS[infoCall?.type]);
      setClientNumber(infoCall?.request?.from?.displayName);
      setIsVisible(true);
    }
  }, [infoCall]);

  useEffect(() => {
    if (
      sessionStatus === STATUS.bye ||
      sessionStatus === STATUS.cancel ||
      sessionStatus === STATUS.rejected ||
      sessionStatus === STATUS.failed
    ) {
      setIsVisible(false);
      setClientNumber('');
      setStatusCall(STATUS.idle);
    }
  }, [sessionStatus]);

  useEffect(() => {
    if (clientStatus === STATUS.bye) {
      setIsVisible(false);
      setClientStatusCall('');
      setClientNumber('');
    }
    if (clientStatus === STATUS.accepted) {
      setClientStatusCall(STATUS.accepted);
    }
  }, [clientStatus]);

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

  const showModal = () => {
    setIsVisible(true);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setVisibleAddLead(false);
    setStatusCall(STATUS.idle);
    setClientStatusCall('');
    setInputNumber('');
  };

  const callNumber = () => {
    setStatusCall(STATUS.outbound);
    performCall(inputNumber, audioRef.current);
  };

  const handleHangupClick = () => {
    setIsVisible(false);
    setStatusCall(STATUS.idle);
    setInputNumber('');
    setClientNumber('');
    handleHangup();
  };

  const handleAnswerClick = () => {
    setStatusCall(STATUS.outbound);
    handleAnswer(audioRef?.current);
  };

  // const openFormAddLead = () => {
  //   setVisibleAddLead(true);
  // };

  // const cancelFormAddLead = () => {
  //   setVisibleAddLead(false);
  // };

  return (
    <>
      <audio ref={audioRef} autoPlay>
        <track kind="captions" />
      </audio>
      <div className={styles['logo-call']} role="presentation" onClick={showModal}>
        <img src="/images/icon/phone.svg" alt="logo-call" />
      </div>

      <Modal
        className={styles['phone-simulator']}
        maskClosable={false}
        footer={null}
        visible={isVisible}
        onCancel={handleCancel}
        width={320}
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
            padding: '0 24px 24px 24px',
            cursor: 'move',
            width: '100%',
            zIndex: 1000,
            marginTop: 40,
          }}
          onMouseOver={() => {
            if (isDisabled) setIsDisabled(false);
          }}
          onMouseOut={() => setIsDisabled(true)}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          {statusCall === STATUS.idle && (
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
          )}

          {statusCall === STATUS.outbound && (
            <>
              <div className={styles['layout-call']}>
                <p className={styles['call-type']}>CUỘC GỌI ĐI</p>
                <div className={styles['avatar-item']}>
                  <img
                    src="/images/icon/user.svg"
                    alt="user-avatar"
                    className={styles['default-avatar']}
                  />
                </div>
                <p className={styles['user-name']}>Không xác định</p>
                <p className={styles['phone-number']}>
                  {!isEmpty(clientNumber) ? clientNumber : inputNumber}
                </p>
                {clientStatusCall === STATUS.accepted && (
                  <Timer active duration={null} className={styles['time-active']}>
                    <Timecode />
                  </Timer>
                )}
                {clientStatusCall === STATUS.bye && (
                  <p className={styles['call-status']}>Đã kết thúc</p>
                )}
                {clientStatusCall !== STATUS.bye && clientStatusCall !== STATUS.accepted && (
                  <p className={styles['call-status']}>Đang kết nối</p>
                )}
                {/* <ButtonCus
                  color="primary"
                  className={styles['button-add-lead']}
                  onClick={openFormAddLead}
                  disabled={isVisibleAddLead}
                >
                  Thêm Lead
                </ButtonCus> */}
              </div>
              {/* <Form>
                <div className={classnames(styles['layout-call'], styles['border-y'])}>
                  <FormItem
                    className={styles['text-note']}
                    name="note"
                    placeholder="Nhập nội dung cuộc gọi"
                    type={variables.TEXTAREA}
                    rules={[variables.RULES.MAX_LENGTH_INPUT]}
                    showCount={false}
                  />
                </div>
              </Form> */}
              <div className={styles['layout-call']}>
                <div className={styles['hangout-group__invidual']}>
                  <div
                    className={classnames(
                      styles['hangout-background__invidual'],
                      styles['hangout-background'],
                      styles['hangout-rotate'],
                    )}
                    role="presentation"
                    onClick={handleHangupClick}
                  >
                    <img src="/images/icon/phone.svg" alt="phone-call" />
                  </div>
                  <p className={styles['hangout-title']}>Kết thúc</p>
                </div>
              </div>
            </>
          )}

          {statusCall === STATUS.inbound && (
            <>
              <div className={styles['layout-call']}>
                <p className={styles['call-type']}>CUỘC GỌI ĐẾN</p>
                <div className={styles['avatar-item']}>
                  <img
                    src="/images/icon/user.svg"
                    alt="user-avatar"
                    className={styles['default-avatar']}
                  />
                </div>
                <p className={styles['user-name']}>Không xác định</p>
                <p className={styles['phone-number']}>{clientNumber}</p>
                <p className={styles['call-status']}>Đang kết nối</p>
              </div>
              <div className={styles['layout-call']}>
                <div className={styles['hangout-group']}>
                  <div className={styles['hangout-item']}>
                    <div
                      className={classnames(
                        styles['hangout-background'],
                        styles['hangout-background__danger'],
                        styles['hangout-rotate'],
                      )}
                      role="presentation"
                      onClick={handleReject}
                    >
                      <img src="/images/icon/phone.svg" alt="phone-call" />
                    </div>
                    <p className={styles['hangout-title']}>Kết thúc</p>
                  </div>
                  {/* <div className={styles['hangout-item']}>
                    <div
                      className={classnames(
                        styles['hangout-background'],
                        styles['hangout-background__success'],
                      )}
                      role="presentation"
                      onClick={handleReject}
                    >
                      <img src="/images/icon/share.svg" alt="phone-call" />
                    </div>
                    <p className={styles['hangout-title']}>Chuyển tiếp</p>
                  </div> */}
                  <div className={styles['hangout-item']}>
                    <div
                      className={classnames(
                        styles['hangout-background'],
                        styles['hangout-background__success'],
                      )}
                      role="presentation"
                      onClick={handleAnswerClick}
                    >
                      <img src="/images/icon/phone.svg" alt="phone-call" />
                    </div>
                    <p className={styles['hangout-title']}>Chấp nhận</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {isVisibleAddLead && (
        <div className={styles['main-form-add-lead']}>
          <p>FORM THÊM LEAD</p>
        </div>
      )}
    </>
  );
}

export default Index;
