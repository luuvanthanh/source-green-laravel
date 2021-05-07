import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

export default function ButtonCustom({ data, remove }) {
  return (
    <div className={classnames(styles.listUpload, 'd-flex', 'flex-wrap')}>
      {data.map((item, index) => (
        <div key={index} className={styles.item}>
          <img
            alt="image"
            aria-hidden
            src={item ? `${API_UPLOAD}${item}` : '/default-upload.png'}
          />
          <span className={styles.icon} onClick={() => remove(item)}>
            <span className="icon-close-circle" />
          </span>
        </div>
      ))}
    </div>
  );
}

ButtonCustom.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
};

ButtonCustom.defaultProps = {
  data: [],
};

ButtonCustom.displayName = 'Button';
