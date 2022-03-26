import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../style.module.scss';
import { handleAnswer, handleReject } from '../handleCallCenter';
import variablesModule from '../variables';

function Inbound({ handleOnClick, audioRef, inboundClient }) {
  const handleInboundEnd = () => {
    if (handleOnClick) {
      handleOnClick(variablesModule.STATUS.outbound);
      handleAnswer(audioRef.current);
    }
  };

  const handleInboundReject = () => {
    if (handleOnClick) {
      handleOnClick(variablesModule.STATUS.idle);
      handleReject();
    }
  };

  return (
    <>
      <div className={styles['layout-call']}>
        <p className={styles['call-type']}>CUỘC GỌI ĐẾN</p>
        <div className={styles['avatar-item']}>
          {inboundClient?.file_image ? (
            <img
              src={`${API_UPLOAD}${JSON.parse(inboundClient?.file_image)}`}
              alt="user-avatar"
              className={styles['default-avatar']}
            />
          ) : (
            <img src="/images/icon/user.svg" alt="user-avatar" />
          )}
        </div>
        <p className={styles['user-name']}>
          {inboundClient?.full_name ? inboundClient.full_name : 'Không xác định'}
        </p>
        <p className={styles['phone-number']}>
          {inboundClient?.phone ? inboundClient.phone : inboundClient.number}
        </p>
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
              onClick={handleInboundReject}
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
              onClick={handleInboundEnd}
            >
              <img src="/images/icon/phone.svg" alt="phone-call" />
            </div>
            <p className={styles['hangout-title']}>Chấp nhận</p>
          </div>
        </div>
      </div>
    </>
  );
}

Inbound.propTypes = {
  handleOnClick: PropTypes.func,
  audioRef: PropTypes.objectOf(PropTypes.any),
  inboundClient: PropTypes.any,
};

Inbound.defaultProps = {
  handleOnClick: () => {},
  audioRef: {},
  inboundClient: null,
};

export default Inbound;
