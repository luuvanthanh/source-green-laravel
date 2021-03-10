import React from 'react';
import Notification from './Notification';
import LiveSearch from './LiveSearch';
import ProfileMenu from './ProfileMenu';
import Toggle from './Toggle';
import styles from './style.module.scss';

class TopBar extends React.Component {
  render() {
    return (
      <div className={styles.topbar}>
        <div className="mr-4"></div>
        <div className="mr-auto" />
        <div className="mr-4">
          <Notification />
        </div>
        <ProfileMenu />
      </div>
    );
  }
}

export default TopBar;
