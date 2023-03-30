import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import styles from '@/assets/styles/Common/common.scss';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import classnames from 'classnames';
import { isEmpty } from 'lodash';

const mapStateToProps = ({ settings, menu }) => ({
  isMenuCollapsed: settings.isMenuCollapsed,
  dataReport: menu.dataReport,
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

  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    // if (this.props.location.pathname.includes('bao-cao-erp') && !isEmpty(this.props.dataReport)) {
    //   this.props.history.push(`/bao-cao-erp/${head(head(this.props.dataReport)?.children)?.id}`);
    // }
    if (this.props.location.pathname.includes('bao-cao-erp') && isEmpty(this.props.dataReport)) {
      dispatch({
        type: 'menu/GET_MENU_REPORT',
        payload: { type: 'METABASE' },
        callback: () => { },
      });
    }
  }

  // componentDidUpdate(prevProps) {
  //   if (size(this.props.dataReport) !== size(prevProps.dataReport)) {
  //     this.props.history.push(`/bao-cao-erp/${head(head(this.props.dataReport)?.children)?.id}`);
  //   }
  // }

  render() {
    const { children, isMenuCollapsed } = this.props;
    return (
      <Layout.Content
        className={classnames({ [`${styles['layout-collapse']}`]: isMenuCollapsed })}
        style={{ height: '100%', position: 'relative' }}
      >
        <div className={styles.content}>{children}</div>
      </Layout.Content>
    );
  }
}

Index.propTypes = {
  children: PropTypes.any,
  isMenuCollapsed: PropTypes.bool,
  dataReport: PropTypes.array,
  location: PropTypes.any,
  dispatch: PropTypes.objectOf(PropTypes.any),

};

Index.defaultProps = {
  children: null,
  isMenuCollapsed: false,
  dataReport: [],
  location: {},
  dispatch: {},

};

export default Index;
