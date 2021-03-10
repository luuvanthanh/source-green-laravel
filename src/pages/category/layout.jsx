import React, { PureComponent } from 'react';
import { isEmpty } from 'lodash';
import { connect, withRouter } from 'umi';
import { Link } from 'umi';
import TopBar from '@/components/LayoutComponents/TopBar';
import { Menu } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import PropTypes from 'prop-types';
import ProfileMenu from '@/components/LayoutComponents/TopBar/ProfileMenu';
import Notification from '@/components/LayoutComponents/TopBar/Notification';
import { Layout } from 'antd';
import classNames from 'classnames';

const MENU_MAIN = [
  {
    key: 'TYPES',
    title: 'Đánh giá học tập',
    url: '/danh-muc/loai-tour',
  },
  {
    key: 'AREAS',
    title: 'Lượng nước uống',
    url: '/danh-muc/loai-hinh-du-lich',
  },
];
const mapStateToProps = ({ settings }) => ({
  isBorderless: settings.isBorderless,
  isSquaredBorders: settings.isSquaredBorders,
  isFixedWidth: settings.isFixedWidth,
  isMenuShadow: settings.isMenuShadow,
  isMenuTop: settings.isMenuTop,
  isMenuCollapsed: settings.isMenuCollapsed,
});
@withRouter
@connect(mapStateToProps)
class Index extends PureComponent {
  render() {
    const {
      children,
      isBorderless,
      isSquaredBorders,
      isFixedWidth,
      isMenuShadow,
      isMenuTop,
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
                selectedKeys={[pathname]}
              >
                {MENU_MAIN.map((item) => (
                  <Menu.Item key={item.url}>
                    <Link to={item.url}>{item.title}</Link>
                  </Menu.Item>
                ))}
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
          className={classNames({ [`${styles['layout-collapse']}`]: isMenuCollapsed })}
          style={{ height: '100%', position: 'relative' }}
        >
          <div className={styles.layout}>{this.props.children}</div>
        </Layout.Content>
      </>
    );
  }
}

Index.propTypes = {
  children: PropTypes.any.isRequired,
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  location: {},
};

export default Index;
