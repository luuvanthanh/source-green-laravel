import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

export default function ButtonCustom({ data }) {
  return (
    <div className={classnames(styles.listUpload, 'd-flex', 'flex-wrap')}>
      {
        data.map((item, index) => (
          <div key={index} className={styles.item}>
            <img alt="image" aria-hidden src={item.src || "/default-upload.png"} />
            <span className={styles.icon}>
              <span className="icon-close-circle" />
            </span>
          </div>
        ))
      }
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
