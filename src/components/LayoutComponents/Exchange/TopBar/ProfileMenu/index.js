import React from 'react';
import { connect } from 'umi';
import { Menu, Dropdown, Avatar } from 'antd';
import PropTypes from 'prop-types';
import { UserOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

@connect(({ user }) => ({ user }))
class ProfileMenu extends React.Component {
  logout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/LOGOUT',
    });
  };

  render() {
    const { user } = this.props;
    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <strong>Hello, {user?.user?.userName || 'Anonymous'}</strong>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <div>
            <strong className="mr-1">Email:</strong>
            {user?.user?.email}
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={this.logout}>
          <span>
            <i className={`${styles.menuIcon} icon-exit`} />
            Logout
          </span>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <div className={styles.dropdown}>
          <div className={styles.content}>
            <h3 className="title">{user?.user?.userName || 'Nguyễn Ngọc Bích'}</h3>
            <p>{user?.user?.name || 'Admin'}</p>
          </div>
          <Avatar className={styles.avatar} icon={<UserOutlined />} shape="square" size="large" />
        </div>
      </Dropdown>
    );
  }
}

ProfileMenu.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
};

ProfileMenu.defaultProps = {
  dispatch: {},
  user: {},
};

export default ProfileMenu;
