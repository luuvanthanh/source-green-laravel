import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import Timecode from 'react-timecode';
import Timer from 'react-timer-wrapper';
import { handleHangup } from '../handleCallCenter';
import styles from '../style.module.scss';
import variablesModule from '../variables';

const Outbound = memo(({ handleOnClick, infoFromOutbound, outboundStatusInfo }) => {
  const handleOutbound = () => {
    if (handleOnClick) {
      handleOnClick(variablesModule.STATUS.idle, '', false);
      handleHangup();
    }
  };

  return (
    <>
      <div className={styles['layout-call']}>
        <p className={styles['call-type']}>CUỘC GỌI ĐI</p>
        {/* Thông tin */}
        <div className={styles['avatar-item']}>
          {infoFromOutbound?.file_image ? (
            <img
              src={`${API_UPLOAD}${JSON.parse(infoFromOutbound?.file_image)}`}
              alt="user-avatar"
              className={styles['default-avatar']}
            />
          ) : (
            <img src="/images/icon/user.svg" alt="user-avatar" />
          )}
        </div>
        <p className={styles['user-name']}>
          {infoFromOutbound?.full_name ? infoFromOutbound.full_name : 'Không xác định'}
        </p>
        <p className={styles['phone-number']}>
          {infoFromOutbound?.phone ? infoFromOutbound.phone : infoFromOutbound.number}
        </p>

        {/* TIMER */}
        {outboundStatusInfo === variablesModule.STATUS.accepted && (
          <Timer active duration={null} className={styles['time-active']}>
            <Timecode />
          </Timer>
        )}

        {/* STATUS */}
        {outboundStatusInfo !== variablesModule.STATUS.accepted && (
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
});

Outbound.propTypes = {
  handleOnClick: PropTypes.func,
  infoFromOutbound: PropTypes.any,
  outboundStatusInfo: PropTypes.string,
};

Outbound.defaultProps = {
  handleOnClick: () => {},
  infoFromOutbound: null,
  outboundStatusInfo: '',
};

export default Outbound;
