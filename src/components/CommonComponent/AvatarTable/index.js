import { Avatar } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { UserOutlined } from '@ant-design/icons';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';

class AvatarTable extends Component {
  render() {
    const { fileImage, size, fullName, description, className } = this.props;
    if (fileImage && fullName) {
      return (
        <div className={classnames(styles['avatar-container'], styles[className])}>
          <Avatar shape="square" size={size || 40} src={`${API_UPLOAD}${fileImage}`} />
          {fullName && description && (
            <div className={styles.info}>
              <p className={styles['title']}>{fullName}</p>
              <p className={styles['norm']}>{description}</p>
            </div>
          )}
          {fullName && !description && (
            <div className={styles.info}>
              <p className={styles['name']}>{fullName}</p>
            </div>
          )}
        </div>
      );
    }
    if (!fileImage && fullName) {
      return (
        <div className={classnames(styles['avatar-container'], `${className ? styles[`${className}`] : ''}`)}>
          <Avatar size={size || 40} shape="square" icon={<UserOutlined />} />
          {fullName && description && (
            <div className={styles.info}>
              <p className={styles['title']}>{fullName}</p>
              <p className={styles['norm']}>{description}</p>
            </div>
          )}
          {fullName && !description && (
            <div className={styles.info}>
              <p className={styles['name']}>{fullName}</p>
            </div>
          )}
        </div>
      );
    }
    if (fileImage && !fullName) {
      return <Avatar shape="square" size={size || 40} src={`${API_UPLOAD}${fileImage}`} />;
    }
    return <Avatar size={size || 40} shape="square" icon={<UserOutlined />} />;
  }
}

AvatarTable.propTypes = {
  user: PropTypes.any,
  size: PropTypes.number,
  fullName: PropTypes.string,
  description: PropTypes.string,
};
AvatarTable.defaultProps = {
  user: {},
  size: 40,
  fullName: '',
  description: '',
};

export default AvatarTable;
