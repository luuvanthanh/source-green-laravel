import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../style.module.scss';
import { handleAnswer, handleReject } from '../handleCallCenter';
import variablesModule from '../variables';
import { isEmpty } from 'lodash';

function Inbound({ handleOnClick, audioRef, infoFromInbound }) {
  const handleInboundAnswer = () => {
    if (handleOnClick) {
      handleOnClick(variablesModule.STATUS.outbound, true);
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
          {infoFromInbound?.file_image !== '[]' && !isEmpty(infoFromInbound?.file_image) ? (
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
              onClick={handleInboundAnswer}
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
  infoFromInbound: PropTypes.any,
};

Inbound.defaultProps = {
  handleOnClick: () => {},
  audioRef: {},
  infoFromInbound: null,
};

export default Inbound;
