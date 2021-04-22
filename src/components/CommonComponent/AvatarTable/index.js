import { Avatar } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { UserOutlined } from '@ant-design/icons';
import styles from '@/assets/styles/Common/common.scss';

class AvatarTable extends Component {
  render() {
    const { fileImage, size, fullName } = this.props;
    if (fileImage && fullName) {
      return (
        <div className={styles['avatar-container']}>
          <Avatar shape="square" size={40} src={`${API_UPLOAD}${fileImage}`} />
          <p className={styles['norm']}>{fullName}</p>
        </div>
      );
    }
    if (!fileImage && fullName) {
      return (
        <div className={styles['avatar-container']}>
          <Avatar size={size} shape="square" icon={<UserOutlined />} />
          <p className={styles['norm']}>{fullName}</p>
        </div>
      );
    }
    return <Avatar size={size} shape="square" icon={<UserOutlined />} />;
  }
}

AvatarTable.propTypes = {
  user: PropTypes.any,
  size: PropTypes.number,
  fullName: PropTypes.string,
};
AvatarTable.defaultProps = {
  user: {},
  size: 40,
  fullName: '',
};

export default AvatarTable;
