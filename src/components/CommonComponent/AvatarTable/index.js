import { Avatar } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { UserOutlined } from '@ant-design/icons';

class AvatarTable extends Component {
  render() {
    const { fileImage } = this.props;
    if (fileImage) {
      return <Avatar size={40} shape="square" src={`${API_UPLOAD}${fileImage}`} />;
    }
    return <Avatar size={40} shape="square" icon={<UserOutlined />} />;
  }
}

AvatarTable.propTypes = {
  user: PropTypes.any,
};
AvatarTable.defaultProps = {
  user: {},
};

export default AvatarTable;
