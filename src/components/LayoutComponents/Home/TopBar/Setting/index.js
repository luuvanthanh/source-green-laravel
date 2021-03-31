import React from 'react';
import classnames from 'classnames';
import { Menu, Dropdown, Badge } from 'antd';
import styles from './style.module.scss';
import { dataSource } from './data.json';

class Notification extends React.Component {
  render() {
    const menu = (
      <div className={styles.activity}>
        <div className={styles['images-container']}>
          {dataSource.map((item, index) => (
            <div
              className={classnames(styles['images-item'], {
                [`${styles.active}`]: item.img === 'images/bg_01.png',
              })}
              key={index}
            >
              <div className={styles.image}>
                <img src={item.img} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    return (
      <Dropdown overlay={menu} trigger={['click']} arrow>
        <div className={styles.dropdown}>
          <Badge>
            <span className={classnames('icon-setting', styles.setting)} />
          </Badge>
        </div>
      </Dropdown>
    );
  }
}

export default Notification;
