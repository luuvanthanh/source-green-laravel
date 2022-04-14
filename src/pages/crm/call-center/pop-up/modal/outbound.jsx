import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import { Form, Tag } from 'antd';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import Timecode from 'react-timecode';
import Timer from 'react-timer-wrapper';
import { handleHangup } from '../handleCallCenter';
import styles from '../style.module.scss';
import variablesModule from '../variables';

const Outbound = memo(({ handleOnClick, infoFromOutbound, outboundStatusInfo, detectAddLead }) => {
  const [formRef] = Form.useForm();

  const handleOutbound = () => {
    if (handleOnClick) {
      handleOnClick(formRef.getFieldValue().content);
      handleHangup();
    }
  };

  // const handleAddLead = () => {
  //   if (detectAddLead) {
  //     detectAddLead();
  //   }
  // };

  return (
    <>
      <div className={styles['layout-call']}>
        <p className={styles['call-type']}>CUỘC GỌI ĐI</p>
        {/* INFO */}
        <div className={styles['avatar-item']}>
          {!isEmpty(infoFromOutbound?.file_image) &&
          infoFromOutbound?.file_image &&
          infoFromOutbound?.file_image !== '[]' ? (
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
        {outboundStatusInfo === variablesModule.STATUS.bye && (
          <p className={styles['call-status']}>Đã kết thúc</p>
        )}
        {/* STATUS */}
        {outboundStatusInfo !== variablesModule.STATUS.accepted &&
          outboundStatusInfo !== variablesModule.STATUS.bye && (
            <p className={styles['call-status']}>Đang kết nối</p>
          )}

        {/* <Tag color="success">Có tiềm năng</Tag>
        <Button color="primary" className="mb10" onClick={handleAddLead}>
          Thêm lead
        </Button> */}
      </div>
      <Form className={styles['form-main']} form={formRef}>
        <FormItem
          placeholder="Nhập nội dung cuộc gọi"
          name="content"
          type={variables.TEXTAREA}
          rules={[variables.RULES.MAX_LENGTH_INPUT]}
          showCount={false}
        />
      </Form>
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
  detectAddLead: PropTypes.func,
};

Outbound.defaultProps = {
  handleOnClick: () => {},
  infoFromOutbound: null,
  outboundStatusInfo: '',
  detectAddLead: () => {},
};

export default Outbound;
