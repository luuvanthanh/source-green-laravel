import { Avatar } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { UserOutlined } from '@ant-design/icons';
import styles from '@/assets/styles/Common/common.scss';

class AvatarTable extends Component {
  render() {
    const { fileImage, size, fullName, description } = this.props;
    if (fileImage && fullName) {
      return (
        <div className={styles['avatar-container']}>
          <Avatar shape="square" size={40} src={`${API_UPLOAD}${fileImage}`} />
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
        <div className={styles['avatar-container']}>
          <Avatar size={size} shape="square" icon={<UserOutlined />} />
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
      return <Avatar shape="square" size={40} src={`${API_UPLOAD}${fileImage}`} />;
    }
    return <Avatar size={size} shape="square" icon={<UserOutlined />} />;
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
