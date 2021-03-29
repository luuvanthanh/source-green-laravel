import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { Link } from 'umi';
import { Menu } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import PropTypes from 'prop-types';
import ProfileMenu from '@/components/LayoutComponents/TopBar/ProfileMenu';
import Notification from '@/components/LayoutComponents/TopBar/Notification';
import { Layout } from 'antd';
import classnames from 'classnames';

const MENU_MAIN = [
  {
    key: 'PARENT',
    title: 'Phụ huynh',
    url: '/ho-so-doi-tuong/phu-huynh',
  },
  {
    key: 'CHILDREN',
    title: 'Học sinh',
    url: '/ho-so-doi-tuong/hoc-sinh',
  },
  {
    key: 'PERSONAL',
    title: 'Nhân sự',
    url: '/ho-so-doi-tuong/nhan-su',
  },
];

const MENU_CREATE = [
  {
    key: 'PARENT',
    title: 'Thông tin cha',
    url: '/ho-so-doi-tuong/phu-huynh/thong-tin-cha',
  },
  {
    key: 'MOTHER',
    title: 'Thông tin mẹ',
    url: '/ho-so-doi-tuong/phu-huynh/thong-tin-me',
  },
  {
    key: 'CHILDREN',
    title: 'Thông tin trẻ',
    url: '/ho-so-doi-tuong/phu-huynh/thong-tin-tre',
  },
];

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
      <>
        <Layout.Header>
          <div className={styles.topbar}>
            <div className="mr-4">
              <Menu
                className={styles['menu-horizontal']}
                mode="horizontal"
                onClick={this.handleClick}
                selectedKeys={[this.activeMenu(pathname)]}
              >
                {MENU_MAIN.map((item) => {
                  return (
                    <Menu.Item key={item.url}>
                      <Link to={item.url}>{item.title}</Link>
                    </Menu.Item>
                  );
                })}
              </Menu>
            </div>
            <div className="mr-auto" />
            <div className="mr-4">
              <Notification />
            </div>
            <ProfileMenu />
          </div>
        </Layout.Header>
        <Layout.Content
          className={classnames({ [`${styles['layout-collapse']}`]: isMenuCollapsed })}
          style={{ height: '100%', position: 'relative' }}
        >
          {pathname.includes('/tao-moi') && (
            <Menu
              className={classnames(styles['menu-horizontal'], styles['menu-horizontal-children'])}
              mode="horizontal"
              onClick={this.handleClick}
              selectedKeys={[pathname]}
            >
              {MENU_CREATE.map((item) => {
                return (
                  <Menu.Item
                    className={classnames({ [`${styles.back}`]: item.isBack })}
                    key={item.url}
                  >
                    <Link to={item.url}>{item.title}</Link>
                  </Menu.Item>
                );
              })}
            </Menu>
          )}

          <div className={styles.content}>{children}</div>
        </Layout.Content>
      </>
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
