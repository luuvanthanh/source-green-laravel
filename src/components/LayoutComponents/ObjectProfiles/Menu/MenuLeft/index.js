import _ from 'lodash';
import React from 'react';
import store from 'store';
import { Helper } from '@/utils';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { connect, Link, withRouter } from 'umi';
import { Menu, Layout, Badge } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './style.module.scss';
import { isValidCondition } from '@/utils/authority';

const { Sider } = Layout;
const { SubMenu, Divider } = Menu;

const mapStateToProps = ({ menu, settings, badges, user }) => ({
  menuData: menu.MenuLeftObjectProfiles,
  isMobileView: settings.isMobileView,
  isLightTheme: settings.isLightTheme,
  isSettingsOpen: settings.isSettingsOpen,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileMenuOpen: settings.isMobileMenuOpen,
  user: user,
});

@withRouter
@connect(mapStateToProps)
class MenuLeft extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      menuData: props.menuData,
      openedKeys: store.get('app.menu.openedKeys') || [],
      selectedKeys: store.get('app.menu.selectedKeys') || [],
    };
  }

  componentWillMount() {
    this.setSelectedKeys(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isMenuCollapsed && !newProps.isMobileView) {
      this.setState({
        openedKeys: [],
      });
    }
    this.setSelectedKeys(newProps);
  }

  componentDidUpdate(prevProps) {
    if (this.props.badges !== prevProps.badges) {
      this.onSetMenu(this.props.badges);
    }
  }

  onSetMenu = (badges) => {
    if (!_.isEmpty(badges)) {
      this.setState((prevState) => ({
        menuData: prevState.menuData,
      }));
    }
  };

  convertPathname = (pathname) => {
    if (pathname) {
      const listItemPath = pathname.split('/');
      return listItemPath
        .map((item) => {
          return Number.parseInt(item, 10) ? ':id' : item;
        })
        .join('/');
    }
    return '';
  };

  setSelectedKeys = (props) => {
    const { menuData } = this.state;
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item);
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key));
        }
        return flattenedItems;
      }, []);
    const selectedItem = flattenItems(menuData, 'children').find((item) => {
      if (_.isArray(item.url)) {
        return item.url.filter(
          (itemChildren) => itemChildren === this.convertPathname(props.location.pathname),
        )[0];
      }
      return item.url === props.location.pathname;
    });
    this.setState({
      selectedKeys: selectedItem ? [selectedItem.key] : [],
    });
  };

  onCollapse = (value, type) => {
    const { dispatch, isMenuCollapsed } = this.props;
    if (type === 'responsive' && isMenuCollapsed) {
      return;
    }

    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMenuCollapsed',
        value: !isMenuCollapsed,
      },
    });

    this.setState({
      openedKeys: [],
    });
  };

  onOpenChange = (openedKeys) => {
    store.set('app.menu.openedKeys', openedKeys);
    this.setState({
      openedKeys,
    });
  };

  handleClick = (e) => {
    const { dispatch, isSettingsOpen } = this.props;
    store.set('app.menu.selectedKeys', [e.key]);
    // custom action on settings menu item
    if (e.key === 'settings') {
      dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: 'isSettingsOpen',
          value: !isSettingsOpen,
        },
      });
      return;
    }
    this.setState({
      selectedKeys: [e.key],
    });
  };

  generateMenuItems = () => {
    const { user } = this.props;
    const { menuData = [] } = this.state;
    const generateItem = (item) => {
      const { key, title, url, icon, disabled, pro } = item;
      if (item.divider) {
        return <Divider key={Math.random()} />;
      }
      if (item.url) {
        return (
          <Menu.Item
            className={classnames({
              [styles['menu-item-custom']]: !this.props.isMenuCollapsed,
            })}
            key={key}
            disabled={disabled}
          >
            {item.target ? (
              <a href={url} rel="noopener noreferrer" target={item.target}>
                {icon && <span className={`${icon} ${styles.icon} icon-collapsed-hidden`} />}
                <span className={styles.title}>{title}</span>
                {pro && <Badge className="ml-2 badge-custom" dot count={item.count || 0} />}
              </a>
            ) : (
              <Link to={_.isArray(url) ? url[0] : url}>
                {icon && <span className={`${icon} ${styles.icon} icon-collapsed-hidden`} />}
                <span className={styles.title}>{title}</span>
                {pro && <Badge className="ml-2 badge-custom" dot count={item.count || 0} />}
              </Link>
            )}
          </Menu.Item>
        );
      }
      return (
        <Menu.Item
          className={classnames({
            [styles['menu-item-custom']]: !this.props.isMenuCollapsed,
          })}
          key={key}
          disabled={disabled}
        >
          {icon && <span className={`${icon} ${styles.icon} icon-collapsed-hidden`} />}
          <span className={styles.title}>{title}</span>
          {pro && <Badge className="ml-2 badge-custom" dot count={item.count || 0} />}
        </Menu.Item>
      );
    };

    const generateSubmenu = (items) => {
      return items.map((menuItem) => {
        const showMenu = isValidCondition({
          conditions: [
            {
              permission: menuItem.permission || [''],
              isOrPermission: menuItem.multiple || false,
            },
          ],
          userPermission: user.permissions,
        });
        if (showMenu) {
          if (menuItem.children) {
            const subMenuTitle = (
              <span key={menuItem.key}>
                <span className={styles.title}>{menuItem.title}</span>
                {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
                {menuItem.pro && (
                  <Badge className="ml-2 badge-custom" dot count={menuItem.count || 0} />
                )}
              </span>
            );
            return (
              <SubMenu key={menuItem.key} title={subMenuTitle}>
                {generateSubmenu(menuItem.children)}
              </SubMenu>
            );
          }
          return generateItem(menuItem);
        }
        return null;
      });
    };

    return menuData.map((menuItem) => {
      const showMenu = isValidCondition({
        conditions: [
          {
            permission: menuItem.permission || [''],
            isOrPermission: menuItem.multiple || false,
          },
        ],
        userPermission: user.permissions,
      });
      if (showMenu) {
        if (menuItem.children) {
          const subMenuTitle = (
            <span key={menuItem.key}>
              <span className={styles.title}>{menuItem.title}</span>
              {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
              {menuItem.pro && (
                <Badge className="ml-2 badge-custom" dot count={menuItem.count || 0} />
              )}
            </span>
          );
          return (
            <SubMenu key={menuItem.key} title={subMenuTitle}>
              {generateSubmenu(menuItem.children)}
            </SubMenu>
          );
        }
        return generateItem(menuItem);
      }
      return null;
    });
  };

  render() {
    const { selectedKeys, openedKeys } = this.state;
    const { isMobileView, isMenuCollapsed, isLightTheme } = this.props;
    const menuSettings = isMobileView
      ? {
          width: 256,
          collapsible: false,
          collapsed: false,
          onCollapse: this.onCollapse,
        }
      : {
          width: 256,
          collapsible: true,
          collapsed: isMenuCollapsed,
          onCollapse: this.onCollapse,
          breakpoint: 'lg',
        };

    const menu = this.generateMenuItems();
    return (
      <Sider
        {...menuSettings}
        className={isLightTheme ? `${styles.menu} ${styles.light}` : styles.menu}
      >
        <div className={styles.logo}>
          <div className={styles.logoContainer}>
            <div className={styles['block-menu']}>
              <img
                alt="Clean UI React Admin Template"
                className={styles.image}
                src="/images/home/contact.svg"
              />
              {!isMenuCollapsed && <h1 className={styles.title}>Hồ sơ đối tượng</h1>}
            </div>
            {!isMenuCollapsed && <span className="icon-toggle"></span>}
          </div>
        </div>
        <Scrollbars
          autoHide
          className={isMobileView ? styles.scrollbarMobile : styles.scrollbarDesktop}
          renderThumbVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                width: '4px',
                borderRadius: 'inherit',
                backgroundColor: '#c5cdd2',
                left: '1px',
              }}
            />
          )}
        >
          <Menu
            className={styles.navigation}
            mode="inline"
            onClick={this.handleClick}
            onOpenChange={this.onOpenChange}
            openKeys={openedKeys}
            selectedKeys={selectedKeys}
            theme={isLightTheme ? 'light' : 'dark'}
            inlineIndent={15}
          >
            {menu}
          </Menu>
        </Scrollbars>
      </Sider>
    );
  }
}

MenuLeft.propTypes = {
  isMobileView: PropTypes.bool,
  permissions: PropTypes.any,
  isMenuCollapsed: PropTypes.bool,
  menuData: PropTypes.arrayOf(PropTypes.any),
  badges: PropTypes.arrayOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
  isSettingsOpen: PropTypes.bool,
  isLightTheme: PropTypes.bool,
};
MenuLeft.defaultProps = {
  isMobileView: false,
  isMenuCollapsed: false,
  menuData: [],
  badges: [],
  dispatch: {},
  user: {},
  isSettingsOpen: false,
  isLightTheme: false,
  permissions: [],
};
export default MenuLeft;
