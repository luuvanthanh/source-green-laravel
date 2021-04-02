import { Link } from 'umi';
import { get } from 'lodash';
import { Avatar } from 'antd';
import PropTypes from 'prop-types';
import ability from '@/utils/ability';
import React, { Component } from 'react';
import styles from './styles.module.scss';

class AvatarTable extends Component {
  render() {
    const { user } = this.props;
    if (!ability.can('show', 'users')) {
      return (
        <div className={styles['table-icon']}>
          <Avatar
            shape="square"
            className={styles.icon}
            size={32}
            src={
              get(user, 'avatar.path')
                ? `${IMAGE_URL}/${get(user, 'avatar.path')}`
                : '/images/avatar-default.png'
            }
          />
          <span className={styles.norm}>{get(user, 'full_name')}</span>
        </div>
      );
    }
    return (
      <div className={styles['table-icon']}>
        <Link to={`/nhan-vien/${get(user, 'id')}?type=info`} className={styles['table-link']}>
          <Avatar
            shape="square"
            className={styles.icon}
            size={32}
            src={
              get(user, 'avatar.path')
                ? `${IMAGE_URL}/${get(user, 'avatar.path')}`
                : '/images/avatar-default.png'
            }
          />
          <span className={styles.norm}>{get(user, 'full_name')}</span>
        </Link>
      </div>
    );
  }
}

AvatarTable.propTypes = {
  user: PropTypes.any,
};
AvatarTable.defaultProps = {
  user: {},
};

export default AvatarTable;
