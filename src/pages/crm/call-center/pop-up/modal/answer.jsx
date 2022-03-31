import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import Timecode from 'react-timecode';
import Timer from 'react-timer-wrapper';
import { handleHangup } from '../handleCallCenter';
import styles from '../style.module.scss';
import variablesModule from '../variables';

const Outbound = memo(({ handleOnClick, inboundStatusInfo, infoFromInbound }) => {
  const handleAnswer = () => {
    if (handleOnClick) {
      handleOnClick(variablesModule.STATUS.idle, '', false, true);
      handleHangup();
    }
  };

  return (
    <>
      <div className={styles['layout-call']}>
        <p className={styles['call-type']}>CUỘC GỌI ĐẾN</p>
        {/* Thông tin */}
        <div className={styles['avatar-item']}>
          {infoFromInbound?.file_image ? (
            <img
              src={`${API_UPLOAD}${JSON.parse(infoFromInbound?.file_image)}`}
              alt="user-avatar"
              className={styles['default-avatar']}
            />
          ) : (
            <img src="/images/icon/user.svg" alt="user-avatar" />
          )}
        </div>
        <p className={styles['user-name']}>
          {infoFromInbound?.full_name ? infoFromInbound.full_name : 'Không xác định'}
        </p>
        <p className={styles['phone-number']}>
          {infoFromInbound?.phone ? infoFromInbound.phone : infoFromInbound.number}
        </p>

        {/* TIMER */}
        {inboundStatusInfo === variablesModule.STATUS.accepted && (
          <Timer active duration={null} className={styles['time-active']}>
            <Timecode />
          </Timer>
        )}

        {/* STATUS */}
        {inboundStatusInfo !== variablesModule.STATUS.accepted && (
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
            onClick={handleAnswer}
          >
            <img src="/images/icon/phone.svg" alt="phone-call" />
          </div>
          <p className={styles['hangout-title']}>Kết thúc</p>
        </div>
      </div>
    </>
  );
});

Outbound.propTypes = {
  handleOnClick: PropTypes.func,
  inboundStatusInfo: PropTypes.string,
  infoFromInbound: PropTypes.any,
};

Outbound.defaultProps = {
  handleOnClick: () => {},
  inboundStatusInfo: '',
  infoFromInbound: null,
};

export default Outbound;
