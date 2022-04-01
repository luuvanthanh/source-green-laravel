import { Modal } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { head, isEmpty } from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { handleOutboundCall, handleInboundCall } from './handleCallCenter';
import Inbound from './modal/inbound';
import Outbound from './modal/outbound';
import Phone from './modal/phone';
import styles from './style.module.scss';
import variablesModule from './variables';

const Index = memo(() => {
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
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

  const [isSaler, setIsSaler] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [statusCall, setStatusCall] = useState(variablesModule.STATUS.idle); // trạng thái điện thoại
  const [outboundNumber, setOutboundNumber] = useState(''); // số gọi đi
  const [inboundClient, setInboundClient] = useState(''); // số khách có thông tin
  const [clientStatusInfo, setClientStatusInfo] = useState(''); // trạng thái máy khách
  const [serverStatusInfo, setServerStatusInfo] = useState(''); // trạng thái máy lẻ
  const audioRef = useRef(null);

  const { serverStatus, infoCall, serverContext } = handleInboundCall();
  const { clientStatus, clientContext } = handleOutboundCall();

  useEffect(() => {
    dispatch({
      type: 'crmCallCenter/GET_EXTENSIONS',
      payload: {
        employee_id_hrm: user.objectInfo?.id,
      },
      callback: (response) => {
        if (response && response.length === 1) {
          setIsSaler(true);
          serverContext(
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

  // useEffect thông tin số điện thoại
  useEffect(() => {
    if (!isEmpty(infoCall)) {
      setStatusCall(variablesModule.STATUS[infoCall?.type]);
      dispatch({
        type: 'crmCallCenter/CHECK_PHONE',
        payload: {
          id: infoCall.request.from.displayName,
        },
        callback: (response) => {
          if (response && !isEmpty(response.data)) {
            setInboundClient(response.data.attributes);
          } else {
            setInboundClient({ number: infoCall.request.from.displayName });
          }
        },
      });
      setIsVisible(true);
    }
  }, [infoCall]);

  useEffect(() => {
    if (
      serverStatus === variablesModule.STATUS.bye ||
      serverStatus === variablesModule.STATUS.cancel ||
      serverStatus === variablesModule.STATUS.rejected ||
      serverStatus === variablesModule.STATUS.failed
    ) {
      setStatusCall(variablesModule.STATUS.idle);
      setIsVisible(false);
      setInboundClient('');
      setServerStatusInfo('');
    }

    if (serverStatus === variablesModule.STATUS.accepted) {
      setServerStatusInfo(variablesModule.STATUS.accepted);
    }
  }, [serverStatus]);

  useEffect(() => {
    if (clientStatus === variablesModule.STATUS.bye) {
      setStatusCall(variablesModule.STATUS.idle);
      setIsVisible(false);
      setClientStatusInfo('');
    }

    if (clientStatus === variablesModule.STATUS.accepted) {
      setClientStatusInfo(variablesModule.STATUS.accepted);
    }
  }, [clientStatus]);

  const showModal = () => {
    setIsVisible(true);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  // PHONE
  const handlePhone = (status, phone) => {
    setStatusCall(status);
    setOutboundNumber(phone);
    clientContext(phone, audioRef.current);
  };

  // OUTBOUND
  const handleOutbound = (status, phone, statusModal) => {
    setStatusCall(status);
    setOutboundNumber(phone);
    setIsVisible(statusModal);
  };

  // INBOUND
  const handleInbound = (status) => {
    setStatusCall(status);
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

          <Modal
            mask={false}
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
              {/* PHONE */}
              <div className={statusCall === variablesModule.STATUS.idle ? 'd-block' : 'd-none'}>
                <Phone handleOnClick={handlePhone} audioRef={audioRef} />
              </div>

              {/* OUTBOUND */}
              <div
                className={statusCall === variablesModule.STATUS.outbound ? 'd-block' : 'd-none'}
              >
                <Outbound
                  handleOnClick={handleOutbound}
                  outboundNumber={outboundNumber}
                  clientStatusInfo={clientStatusInfo}
                  serverStatusInfo={serverStatusInfo}
                  inboundClient={inboundClient}
                />
              </div>

              {/* INBOUND */}
              <div className={statusCall === variablesModule.STATUS.inbound ? 'd-block' : 'd-none'}>
                <Inbound
                  handleOnClick={handleInbound}
                  audioRef={audioRef}
                  inboundClient={inboundClient}
                />
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
});

export default Index;
