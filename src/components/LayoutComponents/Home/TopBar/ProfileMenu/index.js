import React from 'react';
import { connect } from 'umi';
import { Menu, Dropdown } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Cookies from 'universal-cookie';

import { variables } from '@/utils';

import styles from './style.module.scss';


const cookies = new Cookies();
@connect(({ user }) => ({ user }))
class ProfileMenu extends React.Component {
  logout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/LOGOUT',
    });
  };

  swichRole = (role) => {
    const { dispatch, user } = this.props;
    if (role?.name?.toUpperCase() === user?.user?.role?.toUpperCase()) {
      return;
    }
    dispatch({
      type: 'user/SWITCH_ACCOUNT',
      payload: {
        access_token: cookies.get('access_token'),
        token_type: cookies.get('token_type'),
      }
    });
  }

  render() {
    const { user } = this.props;
    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <span className="font-weight-bold">Hello {user?.user?.userName || 'Anonymous'}</span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <div>
            <span className="mr-1 font-weight-bold">Email:</span>
            {user?.user?.email}
            <br />
            <span className="mr-1 font-weight-bold">Phone:</span>
            {user?.user?.phone || '-'}
          </div>
        </Menu.Item>
        <Menu.Divider />
          <Menu.Item>
            <p className="font-weight-bold mb0">Vai trò</p>
            {(user?.user?.roles || [{name: user?.user?.role}]).map((item, index) => (
              <p
                key={index}
                onClick={() => this.swichRole(item)}
                className={classnames(styles.role, `${user?.user?.role?.toUpperCase() === item?.name?.toUpperCase() ? styles.actived : ''}`)}
                aria-hidden
              >
                {variables.ROLES_NAME[item?.name?.toUpperCase()] || ''}
              </p>
            ))}
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
      <Dropdown overlay={menu} trigger={['click']} arrow>
        <div className={styles.dropdown}>{user?.user?.userName}</div>
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
