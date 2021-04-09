import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import styles from '@/assets/styles/Common/common.scss';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import classNames from 'classnames';

const mapStateToProps = ({ settings }) => ({
  isMenuCollapsed: settings.isMenuCollapsed,
});
@withRouter
@connect(mapStateToProps)
class Index extends PureComponent {
  activeMenu = (pathname) => {
    const arrayURL = pathname.split('/');
    if (arrayURL.includes('tao-moi') && pathname.search('/tao-moi') > -1) {
      return arrayURL.slice(0, -1).join('/');
    }
    return pathname;
  };

  render() {
    const {
      children,
      isMenuCollapsed,
      location: { pathname },
    } = this.props;
    return (
      <Layout.Content
        className={classNames({ [`${styles['layout-collapse']}`]: isMenuCollapsed })}
        style={{ height: '100%', position: 'relative' }}
      >
        <div className={styles.content}>{children}</div>
      </Layout.Content>
    );
  }
}

Index.propTypes = {
  children: PropTypes.any.isRequired,
  location: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.any,
  isMenuCollapsed: PropTypes.bool,
};

Index.defaultProps = {
  location: {},
  children: null,
  isMenuCollapsed: false,
};

export default Index;
