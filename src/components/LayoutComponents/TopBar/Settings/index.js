import React from 'react';
import { connect } from 'umi';
import classnames from 'classnames';
import { Menu, Dropdown, Badge } from 'antd';
import styles from './style.module.scss';
import store from 'store';

const mapStateToProps = ({ settings }) => ({
  isSettingsOpen: settings.isSettingsOpen,
});

@connect(mapStateToProps)
class Settings extends React.Component {
  handleClick = (e) => {
    const { dispatch, isSettingsOpen } = this.props;
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isSettingsOpen',
        value: !isSettingsOpen,
      },
    });
  };

  render() {
    return (
      <span className={classnames('icon-setting', styles.toggle)} onClick={this.handleClick}></span>
    );
  }
}

export default Settings;
