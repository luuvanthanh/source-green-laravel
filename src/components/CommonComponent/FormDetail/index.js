import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Tag } from 'antd';
import { variables, Helper } from '@/utils';
import styles from './styles.module.scss';

class FormDetail extends Component {
  render() {
    const { name, label, data, type } = this.props;
    if (type === 'table') {
      return (
        <div>
          <div size="normal" className={styles['general-detail']}>
            <p className={styles.text}>{name}</p>
          </div>
        </div>
      );
    }
    if (type === 'day' && name) {
      return (
        <div className="mb20">
          <div className={styles['wrapper-title']}>
            <label className={styles.text}>{label}</label>
          </div>
          <div size="normal" className={styles['general-detail']}>
            <p className={styles.text}>{Helper.getDate(name, variables.DATE_FORMAT.DATE)}</p>
          </div>
        </div>
      );
    }
    if (type === 'select' && data?.length > 0) {
      return (
        <div className="mb20">
          <div className={styles['wrapper-title']}>
            <label className={styles.text}>{label}</label>
          </div>
          <div size="normal" className={styles['general-detail']}>
            <p className={styles.text}>{data?.find((i) => i?.id === name)?.name}</p>
          </div>
        </div>
      );
    }
    if (type === 'img') {
      return (
        <div>
          <div className={styles['wrapper-title']}>
            <label className={styles.text}>{label}</label>
          </div>
        </div>
      );
    }
    if (type === 'selectTags' && name) {
      return (
        <div className="mb20">
          <div className={styles['wrapper-title']}>
            <label className={styles.text}>{label}</label>
          </div>
          <div size="normal" className={styles['general-detail']}>
            {name?.map((i) => (
              <Tag className={styles.tag}>{i?.name}</Tag>
            ))}
          </div>
        </div>
      );
    }
    if (type === 'textBG' && name) {
      return (
        <div className="mb20">
          <div className={styles['wrapper-title']}>
            <label className={styles.text}>{label}</label>
          </div>
          <div size="normal" className={styles['general-detail']} style={{ background: name }}>
            <p className={styles.text}>{name}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="mb20">
        <div className={styles['wrapper-title']}>
          <label className={styles.text}>{label}</label>
        </div>
        <div size="normal" className={styles['general-detail']}>
          <p className={styles.text}>{name}</p>
        </div>
      </div>
    );
  }
}

FormDetail.propTypes = {
  name: PropTypes.any,
  type: PropTypes.any,
  data: PropTypes.any,
  label: PropTypes.string,
};
FormDetail.defaultProps = {
  name: '',
  label: '',
  data: [],
  type: '',
};

export default FormDetail;
