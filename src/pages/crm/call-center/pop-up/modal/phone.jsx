import { Button, Form, Input } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { memo, useState } from 'react';
import styles from '../style.module.scss';

const Phone = memo(({ handleOnClick }) => {
  const [formRef] = Form.useForm();
  const [inputNumber, setInputNumber] = useState('');

  const phoneBtns = [];
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach((item) => {
    phoneBtns.push(
      <Button
        className={styles['phone-button']}
        onClick={(e) => {
          formRef.setFieldsValue({
            phone: !isEmpty(formRef.getFieldValue().phone)
              ? formRef.getFieldValue().phone + e.target.value
              : e.target.value,
          });
          setInputNumber(formRef.getFieldValue().phone);
        }}
        value={item}
        key={item}
      >
        {item}
      </Button>,
    );
  });

  const callNumber = () => {
    if (handleOnClick) {
      handleOnClick(inputNumber);
      setInputNumber('');
      formRef.resetFields();
    }
  };

  return (
    <>
      <Form form={formRef} className={styles['show-input']}>
        <Form.Item name="phone" onChange={() => setInputNumber(formRef.getFieldValue().phone)}>
          <Input placeholder="Nhập số" />
        </Form.Item>
      </Form>
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
            onClick={() => {
              formRef.setFieldsValue({
                phone:
                  !isEmpty(formRef.getFieldValue().phone) &&
                  formRef.getFieldValue().phone.slice(0, -1),
              });
              setInputNumber(formRef.getFieldValue().phone);
            }}
          >
            <img src="/images/icon/delete.svg" alt="delete-number" />
          </div>
        </div>
      </div>
    </>
  );
});

Phone.propTypes = {
  handleOnClick: PropTypes.func,
};

Phone.defaultProps = {
  handleOnClick: () => {},
};

export default Phone;
