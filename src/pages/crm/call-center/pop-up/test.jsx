import { Modal } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { head, isEmpty } from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { handleOutboundCall, handleInboundCall } from './handleCallCenter';
import Inbound from './modal/inbound';
import Outbound from './modal/outbound';
import Phone from './modal/phone';
import Answer from './modal/answer';
import InboundResult from './modal/result/inbound';
import OutboundResult from './modal/result/outbound';
import styles from './style.module.scss';
import variablesModule from './variables';

const Test = memo(() => {
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const draggleRef = useRef();
  const onStart = (e, uiData) => {
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

  const [user] = useSelector(({ user, crmCallCenter }) => [user, crmCallCenter]);
  const dispatch = useDispatch();

  const { inboundStatus, infoCall, inboundContext } = handleInboundCall();
  const { outboundStatus, outboundEvent, outboundContext } = handleOutboundCall();

  const [isSaler, setIsSaler] = useState(false); // check người dùng CallCenter
  const [status, setStatus] = useState(variablesModule.STATUS.idle); // trạng thái điện thoại

  const [outboundNumber, setOutboundNumber] = useState(''); // số GỌI ĐI (OUT)
  const [isOutbound, setIsOutbound] = useState(false); // check điều kiện GỌI ĐI (OUT)
  const [infoFromOutbound, setInfoFromOutbound] = useState(''); // số GỌI ĐI có thông tin (OUT)
  const [outboundStatusInfo, setOutboundStatusInfo] = useState(''); // trạng thái GỌI ĐI (OUT)
  const [outboundHistory, setOutboundHistory] = useState(outboundEvent); // lịch sử GỌI ĐI (OUT)
  const [contentOutbound, setContentOutbound] = useState(''); // nội dung GỌI ĐI (OUT)

  const [isInbound, setIsInbound] = useState(false); // check điều kiện GỌI ĐẾN (IN)
  const [infoFromInbound, setInfoFromInbound] = useState(''); // số GỌI ĐẾN có thông tin (IN)
  const [inboundStatusInfo, setInboundStatusInfo] = useState(''); // trạng thái GỌI ĐẾN (IN)
  const [inboundHistory, setInboundHistory] = useState({}); // lịch sử GỌI ĐẾN (IN)
  const [contentInbound, setContentInbound] = useState(''); // nội dung GỌI ĐI (IN)

  const audioRef = useRef(null);

  // Connect CallCenter
  useEffect(() => {
    dispatch({
      type: 'crmCallCenter/GET_EXTENSIONS',
      payload: {
        employee_id_hrm: user.objectInfo?.id,
      },
      callback: (response) => {
        if (response && response.length === 1) {
          setIsSaler(true);
          inboundContext(
            head(response).user_id_cmc,
            head(response).password,
            head(response).host_name,
            head(response).port,
            '',
            audioRef.current,
          );
        }
      },
    });
  }, []);

  useEffect(() => {
    // Thông tin số điện thoại GỌI ĐẾN (IN)
    if (!isEmpty(infoCall)) {
      setStatus(variablesModule.STATUS[infoCall?.type]);
      dispatch({
        type: 'crmCallCenter/CHECK_PHONE',
        payload: {
          id: infoCall.request.from.displayName,
        },
        callback: (response) => {
          if (response && !isEmpty(response.parsePayload)) {
            setInfoFromInbound(response.parsePayload);
          } else {
            setInfoFromInbound({ number: infoCall.request.from.displayName });
          }
        },
      });
      setIsVisible(true);
    }
  }, [infoCall]);

  // Thông tin số điện thoại GỌI ĐI (OUT)
  useEffect(() => {
    if (!isEmpty(outboundNumber)) {
      dispatch({
        type: 'crmCallCenter/CHECK_PHONE',
        payload: {
          id: outboundNumber,
        },
        callback: (response) => {
          if (response && !isEmpty(response.parsePayload)) {
            setInfoFromOutbound(response.parsePayload);
          } else {
            setInfoFromOutbound({ number: outboundNumber });
          }
        },
      });
    }
  }, [outboundNumber]);

  // Update trạng thái các state GỌI ĐẾN (IN)
  useEffect(() => {
    // if (
    //   (inboundStatus === variablesModule.STATUS.bye ||
    //     inboundStatus === variablesModule.STATUS.cancel ||
    //     inboundStatus === variablesModule.STATUS.rejected ||
    //     inboundStatus === variablesModule.STATUS.failed) &&
    //   inboundHistory.hangup_cause === variablesModule.SOCKET_STATUS.originator_cancel
    // ) {
    //   // reset state
    //   setStatus(variablesModule.STATUS.idle);
    //   setIsVisible(false);
    //   // setInfoFromInbound('');
    //   setInfoFromOutbound('');
    //   setInboundStatusInfo('');
    //   setIsInbound(false);

    //   setInboundHistory({});
    // }
    if (inboundStatus === variablesModule.STATUS.failed && isEmpty(inboundHistory)) {
      // reset state
      setStatus(variablesModule.STATUS.idle);
      setIsVisible(false);
      setInfoFromInbound('');
      // setInfoFromOutbound('');
      setInboundStatusInfo('');
      setIsInbound(false);

      setInboundHistory({});
    }

    if (inboundStatus === variablesModule.STATUS.accepted) {
      setInboundStatusInfo(variablesModule.STATUS.accepted);
    }
  }, [inboundStatus]);

  // Update trạng thái các state GỌI ĐI (OUT)
  useEffect(() => {
    // if (
    //   outboundStatus === variablesModule.STATUS.bye ||
    //   outboundStatus === variablesModule.STATUS.cancel ||
    //   outboundStatus === variablesModule.STATUS.rejected ||
    //   outboundStatus === variablesModule.STATUS.failed
    // ) {
    //   // reset state
    //   setStatus(variablesModule.STATUS.idle);
    //   setIsVisible(false);
    //   setInfoFromInbound('');
    //   setInfoFromOutbound('');
    //   setOutboundStatusInfo('');
    //   setIsOutbound(false);
    // }
    if (outboundStatus === variablesModule.STATUS.failed && isEmpty(outboundHistory)) {
      // reset state
      setStatus(variablesModule.STATUS.idle);
      setIsVisible(false);
      // setInfoFromInbound('');
      setInfoFromOutbound('');
      setOutboundStatusInfo('');
      setIsOutbound(false);

      setOutboundHistory({});
    }

    if (outboundStatus === variablesModule.STATUS.accepted) {
      setOutboundStatusInfo(variablesModule.STATUS.accepted);
    }
  }, [outboundStatus]);

  useEffect(() => {
    const socket = io('https://socket-crm-dev.dn.greenglobal.vn', {
      transports: ['websocket'],
    });
    socket.on('connect', () => {
      socket.emit('subscribe', {
        channel: 'receive-call',
      });
    });
    socket.on('receive.call.event', (e, d) => {
      if (d.data.hangup_cause !== variablesModule.SOCKET_STATUS.originator_cancel) {
        setInboundHistory(d.data);
      } else {
        setInboundHistory({});
      }
    });
  }, [infoCall.id]);

  useEffect(() => {
    setOutboundHistory(outboundEvent);
  }, [outboundEvent.callId]);

  const showModal = () => {
    setIsVisible(true);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  // PHONE (OUT)
  const handlePhone = (status, phone, condition) => {
    setStatus(status);
    setOutboundNumber(phone);
    setIsOutbound(condition);
    outboundContext(phone, audioRef.current);
  };

  // OUTBOUND (OUT)
  const handleOutbound = (status, phone, statusModal, content) => {
    // setStatus(status);
    // setOutboundNumber(phone);
    // setIsVisible(statusModal);
    setContentOutbound(content);
  };

  // OUTBOUND RESULT (OUT)
  const handleOutboundResult = () => {
    setStatus(variablesModule.STATUS.idle);
    setIsVisible(false);
    setInfoFromInbound('');
    setInfoFromOutbound('');
    setOutboundStatusInfo('');
    setIsOutbound(false);

    setOutboundHistory({});
  };

  // INBOUND (IN)
  const handleInbound = (status, condition) => {
    setStatus(status);
    setIsInbound(condition);
  };

  // ANSWER (IN)
  const handleAnswer = (content) => {
    setContentInbound(content);
  };

  // INBOUND RESULT (IN)
  const handleInboundResult = () => {
    setStatus(variablesModule.STATUS.idle);
    setIsVisible(false);
    setInfoFromInbound('');
    setInfoFromOutbound('');
    setInboundStatusInfo('');
    setIsInbound(false);

    setInboundHistory({});
  };

  return (
    <>
      {isSaler && (
        <>
          <audio ref={audioRef} preload="none" autoPlay>
            <track kind="captions" />
          </audio>
          <div className={styles['logo-call']} role="presentation" onClick={showModal}>
            <img src="/images/icon/phone.svg" alt="logo-call" />
          </div>

          <Modal
            mask={false}
            className={styles['phone-simulator']}
            maskClosable={false}
            footer={null}
            visible={isVisible}
            onCancel={handleCancel}
            width={320}
            zIndex={1000}
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
              {/* PHONE */}
              <div className={status === variablesModule.STATUS.idle ? 'd-block' : 'd-none'}>
                <Phone handleOnClick={handlePhone} audioRef={audioRef} />
              </div>

              {/* OUTBOUND */}
              <div
                className={
                  status === variablesModule.STATUS.outbound && isOutbound ? 'd-block' : 'd-none'
                }
              >
                <Outbound
                  handleOnClick={handleOutbound}
                  infoFromOutbound={infoFromOutbound}
                  outboundStatusInfo={outboundStatusInfo}
                />
              </div>

              {/* ANSWER */}
              <div
                className={
                  status === variablesModule.STATUS.outbound && isInbound ? 'd-block' : 'd-none'
                }
              >
                <Answer
                  handleOnClick={handleAnswer}
                  inboundStatusInfo={inboundStatusInfo}
                  infoFromInbound={infoFromInbound}
                />
              </div>

              {/* INBOUND */}
              <div className={status === variablesModule.STATUS.inbound ? 'd-block' : 'd-none'}>
                <Inbound
                  handleOnClick={handleInbound}
                  audioRef={audioRef}
                  infoFromInbound={infoFromInbound}
                />
              </div>
            </div>
          </Modal>

          <Modal
            mask={false}
            title="Kết quả cuộc gọi"
            className={styles['call-result-modal']}
            closable={false}
            visible={!isEmpty(inboundHistory) || !isEmpty(outboundHistory)}
            width={350}
            footer={null}
          >
            {/* INBOUND RESULT */}
            <div className={!isEmpty(inboundHistory) ? 'd-block' : 'd-none'}>
              <InboundResult
                handleOnClick={handleInboundResult}
                inboundHistory={inboundHistory}
                infoFromInbound={infoFromInbound}
                contentInbound={contentInbound}
              />
            </div>

            {/* OUTBOUND RESULT */}
            <div className={!isEmpty(outboundHistory) ? 'd-block' : 'd-none'}>
              <OutboundResult
                handleOnClick={handleOutboundResult}
                outboundHistory={outboundHistory}
                infoFromOutbound={infoFromOutbound}
                contentOutbound={contentOutbound}
              />
            </div>
          </Modal>

          {/* {isVisibleAddLead && (
            <div className={styles['main-form-add-lead']}>
              <p>FORM THÊM LEAD</p>
            </div>
          )} */}
        </>
      )}
    </>
  );
});

export default Test;
