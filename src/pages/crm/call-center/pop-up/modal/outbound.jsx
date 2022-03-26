import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'dva';
import { isEmpty } from 'lodash';
import Timecode from 'react-timecode';
import Timer from 'react-timer-wrapper';
import { handleHangup } from '../handleCallCenter';
import styles from '../style.module.scss';
import variablesModule from '../variables';

const Outbound = memo(
  ({ handleOnClick, outboundNumber, clientStatusInfo, serverStatusInfo, inboundClient }) => {
    const dispatch = useDispatch();
    const [outboundServer, setOutboundServer] = useState(''); // số gọi đi từ máy lẻ

    const handleOutbound = () => {
      if (handleOnClick) {
        handleOnClick(variablesModule.STATUS.idle, '', false);
        handleHangup();
      }
    };

    useEffect(() => {
      if (!isEmpty(outboundNumber)) {
        dispatch({
          type: 'crmCallCenter/CHECK_PHONE',
          payload: {
            id: outboundNumber,
          },
          callback: (response) => {
            if (response && !isEmpty(response.data)) {
              setOutboundServer(response.data.attributes);
            } else {
              setOutboundServer({ number: outboundNumber });
            }
          },
        });
      }
    }, [outboundNumber]);

    return (
      <>
        <div className={styles['layout-call']}>
          <p className={styles['call-type']}>CUỘC GỌI ĐI</p>
          {/* Thông tin */}
          <div className={styles['avatar-item']}>
            {/* GỌI ĐẾN TỪ CLIENT */}
            {(serverStatusInfo === variablesModule.STATUS.accepted || inboundClient) &&
              (inboundClient?.file_image ? (
                <img
                  src={`${API_UPLOAD}${JSON.parse(inboundClient?.file_image)}`}
                  alt="user-avatar"
                  className={styles['default-avatar']}
                />
              ) : (
                <img src="/images/icon/user.svg" alt="user-avatar" />
              ))}

            {/* GỌI ĐI TỪ SERVER */}
            {(clientStatusInfo === variablesModule.STATUS.track_added || outboundServer) &&
              (outboundServer?.file_image ? (
                <img
                  src={`${API_UPLOAD}${JSON.parse(outboundServer?.file_image)}`}
                  alt="user-avatar"
                  className={styles['default-avatar']}
                />
              ) : (
                <img src="/images/icon/user.svg" alt="user-avatar" />
              ))}
          </div>
          <p className={styles['user-name']}>
            {/* GỌI ĐẾN TỪ CLIENT */}
            {(serverStatusInfo === variablesModule.STATUS.accepted || inboundClient) &&
              (inboundClient?.full_name ? inboundClient.full_name : 'Không xác định')}

            {/* GỌI ĐI TỪ SERVER */}
            {(clientStatusInfo === variablesModule.STATUS.track_added || outboundServer) &&
              (outboundServer?.full_name ? outboundServer.full_name : 'Không xác định')}
          </p>
          <p className={styles['phone-number']}>
            {/* GỌI ĐẾN TỪ CLIENT */}
            {(serverStatusInfo === variablesModule.STATUS.accepted || inboundClient) &&
              (inboundClient?.phone ? inboundClient.phone : inboundClient.number)}

            {/* GỌI ĐI TỪ SERVER */}
            {(clientStatusInfo === variablesModule.STATUS.track_added || outboundServer) &&
              (outboundServer?.phone ? outboundServer.phone : outboundServer.number)}
          </p>

          {/* TIMER */}
          {(clientStatusInfo === variablesModule.STATUS.accepted ||
            serverStatusInfo === variablesModule.STATUS.accepted) && (
            <Timer active duration={null} className={styles['time-active']}>
              <Timecode />
            </Timer>
          )}

          {/* STATUS */}
          {(clientStatusInfo !== variablesModule.STATUS.accepted ||
            serverStatusInfo !== variablesModule.STATUS.accepted) && (
            <p className={styles['call-status']}>Đang kết nối</p>
          )}
        </div>
        <div className={styles['layout-call']}>
          <div className={styles['hangout-group__invidual']}>
            <div
              className={classnames(
                styles['hangout-background__invidual'],
                styles['hangout-background'],
                styles['hangout-rotate'],
              )}
              role="presentation"
              onClick={handleOutbound}
            >
              <img src="/images/icon/phone.svg" alt="phone-call" />
            </div>
            <p className={styles['hangout-title']}>Kết thúc</p>
          </div>
        </div>
      </>
    );
  },
);

Outbound.propTypes = {
  handleOnClick: PropTypes.func,
  outboundNumber: PropTypes.string,
  clientStatusInfo: PropTypes.string,
  serverStatusInfo: PropTypes.string,
  inboundClient: PropTypes.any,
};

Outbound.defaultProps = {
  handleOnClick: () => {},
  outboundNumber: '',
  clientStatusInfo: '',
  serverStatusInfo: '',
  inboundClient: null,
};

export default Outbound;
