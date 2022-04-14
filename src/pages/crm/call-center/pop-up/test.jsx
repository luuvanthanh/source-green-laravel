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
import AddLead from './modal/addLead';
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

  const [user] = useSelector(({ user, crmCallCenter, crmHistoryCall }) => [
    user,
    crmCallCenter,
    crmHistoryCall,
  ]);
  const dispatch = useDispatch();

  const { inboundStatus, infoCall, inboundContext } = handleInboundCall();
  const { outboundStatus, outboundEvent, outboundContext } = handleOutboundCall();

  const [isSaler, setIsSaler] = useState(false); // check người dùng CallCenter
  const [isCalling, setIsCalling] = useState(false); // check đang trong cuộc gọi
  const [isVisibleAddLead, setIsVisibleAddLead] = useState(false); // check form add lead

  const [outboundNumber, setOutboundNumber] = useState(''); // số GỌI ĐI (OUT)
  const [isOutbound, setIsOutbound] = useState(false); // check điều kiện GỌI ĐI (OUT)
  const [infoFromOutbound, setInfoFromOutbound] = useState(''); // số GỌI ĐI có thông tin (OUT)
  const [outboundStatusInfo, setOutboundStatusInfo] = useState(''); // trạng thái GỌI ĐI (OUT)
  const [outboundHistory, setOutboundHistory] = useState(outboundEvent); // lịch sử GỌI ĐI (OUT)
  const [contentOutbound, setContentOutbound] = useState(''); // nội dung GỌI ĐI (OUT)
  const [isVisibleAnswer, setIsVisibleAnswer] = useState(false); // check modal GỌI ĐI (OUT)

  const [isInbound, setIsInbound] = useState(false); // check điều kiện GỌI ĐẾN (IN)
  const [infoFromInbound, setInfoFromInbound] = useState(''); // số GỌI ĐẾN có thông tin (IN)
  const [inboundStatusInfo, setInboundStatusInfo] = useState(''); // trạng thái GỌI ĐẾN (IN)
  const [inboundHistory, setInboundHistory] = useState({}); // lịch sử GỌI ĐẾN (IN)
  const [contentInbound, setContentInbound] = useState(''); // nội dung GỌI ĐI (IN)
  const [isVisibleInbound, setIsVisibleInbound] = useState(false); // check modal GỌI ĐẾN (IN)
  const [inboundId, setInboundId] = useState(''); // check id GỌI ĐẾN (IN)

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
    dispatch({
      type: 'crmHistoryCall/GET_DATA',
    });
  }, []);

  useEffect(() => {
    // Thông tin số điện thoại GỌI ĐẾN (IN)
    if (!isEmpty(infoCall) && !isCalling) {
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
      setIsVisible(false);
      setIsVisibleInbound(true);
    }
    if (isEmpty(inboundId)) {
      setInboundId(infoCall?.id);
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
    if (inboundStatus === variablesModule.STATUS.failed && isEmpty(inboundHistory)) {
      setIsVisibleInbound(false);
      setInfoFromInbound('');
      setInboundStatusInfo('');
      setIsInbound(false);

      setInboundHistory({});
    }

    if (inboundStatus === variablesModule.STATUS.accepted) {
      setInboundStatusInfo(variablesModule.STATUS.accepted);
    }

    if (inboundStatus === variablesModule.STATUS.bye) {
      setInboundStatusInfo(variablesModule.STATUS.bye);
    }
  }, [inboundStatus]);

  // Update trạng thái các state GỌI ĐI (OUT)
  useEffect(() => {
    if (outboundStatus === variablesModule.STATUS.failed && isEmpty(outboundHistory)) {
      setIsVisibleAnswer(false);
      setInfoFromOutbound('');
      setOutboundStatusInfo('');
      setIsOutbound(false);
      setOutboundNumber('');

      setOutboundHistory({});
    }

    if (outboundStatus === variablesModule.STATUS.accepted) {
      setOutboundStatusInfo(variablesModule.STATUS.accepted);
    }

    if (outboundStatus === variablesModule.STATUS.bye) {
      setOutboundStatusInfo(variablesModule.STATUS.bye);
      setOutboundNumber('');
    }
  }, [outboundStatus]);

  useEffect(() => {
    const socket = io(URL_SOCKET_LIVE, {
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
  const handlePhone = (phone) => {
    setIsVisible(false);
    setIsVisibleAnswer(true);
    setOutboundNumber(phone);
    setIsOutbound(true);
    setIsCalling(true);
    outboundContext(phone, audioRef.current);
  };

  // OUTBOUND (OUT)
  const handleOutbound = (content) => {
    setContentOutbound(content);
  };

  const handleDetectAddLead = () => {
    setIsVisibleAddLead(true);
  };

  const handleAddLead = () => {
    setIsVisibleAddLead(false);
  };

  // OUTBOUND RESULT (OUT)
  const handleOutboundResult = () => {
    setIsVisibleAnswer(false);
    setInfoFromInbound('');
    setInfoFromOutbound('');
    setOutboundStatusInfo('');
    setIsOutbound(false);
    setIsCalling(false);

    setOutboundHistory({});
  };

  // INBOUND (IN)
  const handleInbound = (status) => {
    if (status) {
      setIsVisibleInbound(false);
    } else {
      setIsVisibleInbound(false);
      setIsVisibleAnswer(true);
      setIsInbound(true);
      setIsCalling(true);
    }
  };

  // ANSWER (IN)
  const handleAnswer = (content) => {
    setContentInbound(content);
  };

  // INBOUND RESULT (IN)
  const handleInboundResult = () => {
    setIsVisibleAnswer(false);
    setInfoFromInbound('');
    setInfoFromOutbound('');
    setInboundStatusInfo('');
    setIsInbound(false);
    setIsCalling(false);

    setInboundHistory({});
    setInboundId('');
  };

  return (
    <>
      {isSaler && (
        <>
          <audio ref={audioRef} autoPlay>
            <track kind="captions" />
          </audio>
          <div className={styles['logo-call']} role="presentation" onClick={showModal}>
            <img src="/images/icon/phone.svg" alt="logo-call" />
          </div>

          {/* PHONE */}
          <Modal
            mask={false}
            className={styles['phone-simulator']}
            maskClosable={false}
            width={320}
            visible={isVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <div className={styles['modal-phone']}>
              <Phone handleOnClick={handlePhone} isCalling={isCalling} />
            </div>
          </Modal>

          {/* INBOUND */}
          <Modal
            mask={false}
            className={styles['phone-simulator']}
            maskClosable={false}
            closable={false}
            width={320}
            visible={isVisibleInbound && !isCalling}
            onCancel={handleCancel}
            footer={null}
          >
            <div className={styles['modal-inbound']}>
              <Inbound
                handleOnClick={handleInbound}
                audioRef={audioRef}
                infoFromInbound={infoFromInbound}
              />
            </div>
          </Modal>

          {/* OUTBOUND & ANWSER */}
          <Modal
            mask={false}
            className={styles['phone-simulator']}
            maskClosable={false}
            closable={false}
            footer={null}
            visible={isVisibleAnswer}
            // visible
            onCancel={handleCancel}
            width={320}
            zIndex={900}
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
              className={styles['modal-answer']}
              onMouseOver={() => {
                if (isDisabled) setIsDisabled(false);
              }}
              onMouseOut={() => setIsDisabled(true)}
              onFocus={() => {}}
              onBlur={() => {}}
            >
              {/* OUTBOUND */}
              <div className={isOutbound ? 'd-block' : 'd-none'}>
                <Outbound
                  handleOnClick={handleOutbound}
                  infoFromOutbound={infoFromOutbound}
                  outboundStatusInfo={outboundStatusInfo}
                  detectAddLead={handleDetectAddLead}
                />
              </div>

              {/* ANSWER */}
              <div className={isInbound && !isEmpty(inboundId) ? 'd-block' : 'd-none'}>
                <Answer
                  handleOnClick={handleAnswer}
                  inboundStatusInfo={inboundStatusInfo}
                  infoFromInbound={infoFromInbound}
                />
              </div>
            </div>
          </Modal>

          {/* RESULT */}
          <Modal
            mask={false}
            title="Kết quả cuộc gọi"
            className={styles['call-result-modal']}
            closable={false}
            visible={
              (!isEmpty(inboundHistory) &&
                inboundHistory.call_status !== variablesModule.STATUS.rejected) ||
              !isEmpty(outboundHistory)
            }
            width={350}
            zIndex={900}
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
            <div
              className={
                !isEmpty(outboundHistory) && inboundId === infoCall?.id ? 'd-block' : 'd-none'
              }
            >
              <OutboundResult
                handleOnClick={handleOutboundResult}
                outboundHistory={outboundHistory}
                infoFromOutbound={infoFromOutbound}
                contentOutbound={contentOutbound}
              />
            </div>
          </Modal>

          {isVisibleAddLead && <AddLead handleOnClick={handleAddLead} />}
        </>
      )}
    </>
  );
});

export default Test;
