import React, { PureComponent } from 'react';
import { Navlink } from 'umi';
import classnames from 'classnames';
import styles from './style.module.scss';

class Index extends PureComponent {
  render() {
    const { dataSource } = this.props;
    return (
      <div className={styles.menu}>
        {dataSource.map((item, index) => (
          <Navlink
            key={index}
            to="/"
            className={classnames(styles.link, { [`${styles.actiive}`]: item.active })}
          >
            {item.name} {item.count}
          </Navlink>
        ))}
      </div>
    );
  }
}

Index.propTypes = {};

export default Index;
