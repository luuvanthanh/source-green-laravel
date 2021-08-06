import React, { useState } from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { variables } from '@/utils';
import styles from './styles.module.scss';

export default function InputNumberCus({ value = null, onChange }) {
  const [number, setNumber] = useState(null);

  const triggerChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const onNumberChange = (e) => {
    const newNumber = parseInt(e || '0', 10);
    setNumber(newNumber);

    triggerChange(newNumber);
  };

  const onPlus = () => {
    setNumber(number + 1);

    triggerChange(number + 1);
  };

  const onSub = () => {
    setNumber(number - 1);

    triggerChange(number - 1);
  };

  return (
    <div className={classnames(styles['input-container'], 'd-flex')}>
      <div
        className={classnames(
          styles.shape,
          'd-flex',
          'align-items-center',
          'justify-content-center',
        )}
        role="presentation"
        onClick={onSub}
      >
        -
      </div>
      <InputNumber
        onChange={onNumberChange}
        value={value || number}
        formatter={(value) => `${value}`.replace(variables.REGEX_NUMBER, ',')}
      />
      <div
        className={classnames(
          styles.shape,
          styles['shape-right'],
          'd-flex',
          'align-items-center',
          'justify-content-center',
        )}
        role="presentation"
        onClick={onPlus}
      >
        +
      </div>
    </div>
  );
}

InputNumberCus.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};

InputNumberCus.defaultProps = {
  value: null,
  onChange: () => {},
};
