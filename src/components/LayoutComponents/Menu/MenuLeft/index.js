import _, { size } from 'lodash';
import React from 'react';
import store from 'store';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { connect, Link, withRouter, history } from 'umi';
import { Menu, Layout, Badge, Popover } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { isValidCondition } from '@/utils/authority';
import validator from 'validator';
import { Helper, variables } from '@/utils';
import feature from '@/services/feature';
import styles from './style.module.scss';

const { Sider } = Layout;
const { SubMenu, Divider } = Menu;

const mapStateToProps = ({ menu, settings, user, englishStudyPlan }) => ({
  menuData: menu.menuLeftSchedules,
  isMobileView: settings.isMobileView,
  isLightTheme: settings.isLightTheme,
  isSettingsOpen: settings.isSettingsOpen,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileMenuOpen: settings.isMobileMenuOpen,
  categories: settings.categories,
  user,
  checkUse: englishStudyPlan.checkUse,
});

@withRouter
@connect(mapStateToProps)
class MenuLeft extends React.Component {
  constructor(props, context) {
    super(props, context);
    const { user } = props;
    this.state = {
      count: 0 || null,
      countProbationary: 0 || null,
      menuData: props.menu || props.menuData,
      openedKeys: store.get('app.menu.openedKeys') || [],
      selectedKeys: store.get('app.menu.selectedKeys') || [],
      data: feature.FEATURES.filter((menuItem) => {
        if (_.isEmpty(menuItem.permission)) {
          return true;
        }
        const showMenu = isValidCondition({
          conditions: [
            {
              permission: !_.isEmpty(menuItem.permission) ? menuItem.permission : [],
              isOrPermission: menuItem.multiple || false,
            },
          ],
          userPermission: user.permissions,
        });
        return showMenu;
      }),
    };
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    this.setSelectedKeys(this.props);
  }

  componentDidMount() {
    const {
      dispatch,
      location: { pathname },
    } = this.props;
    if (/^\/quan-ly-nhan-su(?=\/|$)/i.test(pathname)) {
      dispatch({
        type: 'settings/GET_COUNT_LABOURS_CONTRACT',
        payload: {},
        callback: (response) => {
          this.setState({ count: size(response) });
        },
      });
      dispatch({
        type: 'settings/GET_COUNT_PROBATIONARY_CONTRACT',
        payload: {},
        callback: (response) => {
          this.setState({ countProbationary: size(response) });
        },
      });
    }
    if (/^\/bao-cao-erp(?=\/|$)/i.test(pathname)) {
      this.props.dispatch({
        type: 'menu/GET_MENU_REPORT',
        payload: { type: 'METABASE' },
        callback: (response) => {
          if (response) {
            const dataMenu = response?.map((item) => ({
              title: item.name,
              key: `report-${item.id}`,
              url: [`/bao-cao-erp/${item.id}`],
              permission: [],
              pro: true,
            }));
            this.onSetMenu(dataMenu);
          }
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.onSetMenu(this.props.menu);
    }
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(newProps) {
    if (newProps.isMenuCollapsed && !newProps.isMobileView) {
      this.setState({
        openedKeys: [],
      });
    }
    this.setSelectedKeys(newProps);
  }

  onSetMenu = (badges) => {
    if (!_.isEmpty(badges)) {
      this.setState({
        menuData: badges,
      });
    }
  };

  convertPathname = (pathname) => {
    if (pathname) {
      const listItemPath = pathname.split('/');
      return listItemPath
        .map((item) => (validator.isUUID(item) || Number.parseInt(item, 10) ? ':id' : item))
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
          (itemChildren) =>
            itemChildren === this.convertPathname(props.location.pathname) ||
            itemChildren === props.location.pathname,
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

  onClickItem = (url, type) => {
    const { checkUse } = this.props;
    const text = variables.RULES.ERR_STUDY_PLANE;
    if (checkUse?.check) {
      Helper.confirmDeleteEnglish(
        {
          callback: () => {
            this.props.dispatch({
              type: 'englishStudyPlan/CHECK_USE',
              payload: { check: false },
            });
            if (type === 'ITEM') {
              history.push(url[0]);
            }
            if (type === 'LOGO') {
              history.push(url);
            }
          },
        },
        text,
      );
    } else {
      this.props.dispatch({
        type: 'englishStudyPlan/CHECK_USE',
        payload: { check: false },
      });
    }
  };

  generateMenuItems = () => {
    const { user, checkUse } = this.props;
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
              <Link
                to={_.isArray(url) && !checkUse?.check ? url[0] : url}
                onClick={() => this.onClickItem(url, 'ITEM')}
              >
                {icon && <span className={`${icon} ${styles.icon} icon-collapsed-hidden`} />}
                <span className={styles.title}>{title}</span>
                {key === 'labours-contracts' && (
                  <Badge className="ml-2 badge-custom" dot count={this.state.count || 0} />
                )}
                {key === 'probationary-contracts' && (
                  <Badge
                    className="ml-2 badge-custom"
                    dot
                    count={this.state.countProbationary || 0}
                  />
                )}
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
          {item.key === 'contracts' && (
            <Badge
              className="ml-2 badge-custom"
              dot
              count={this.state.count || this.state.countProbationary || 0}
            />
          )}
        </Menu.Item>
      );
    };

    const generateSubmenu = (items) =>
      items.map((menuItem) => {
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
                {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
                <span className={styles.title}>{menuItem.title}</span>
                {menuItem.key === 'contracts' && (
                  <Badge
                    className="ml-2 badge-custom"
                    dot
                    count={this.state.count || this.state.countProbationary || 0}
                  />
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

    return menuData.map((menuItem) => {
      const showMenu = isValidCondition({
        conditions: [
          {
            permission: menuItem.permission || [''],
            isOrPermission: _.size(menuItem.permission) > 1,
          },
        ],
        userPermission: user.permissions,
      });
      if (showMenu) {
        if (menuItem.children) {
          const subMenuTitle = (
            <span key={menuItem.key}>
              {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
              <span className={styles.title}>{menuItem.title}</span>
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
    const { selectedKeys, openedKeys, data } = this.state;
    const { isMobileView, isMenuCollapsed, isLightTheme, info, checkUse } = this.props;
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
    const content = (
      <Scrollbars autoHeight autoHeightMax="50vh">
        <div className={styles['popover-container']}>
          {data.map((item, index) => {
            if (item.target) {
              return (
                <a
                  href={!checkUse?.check && item.url}
                  target="_blank"
                  className={styles.item}
                  key={index}
                  rel="noreferrer"
                >
                  <div className={styles['item-image']}>
                    <img src={item.src} alt="notification" className={styles.icon} />
                  </div>
                  <div className={styles['item-content']}>
                    <p className={styles.norm}>{item.title}</p>
                  </div>
                </a>
              );
            }
            return (
              <Link to={item.url} className={styles.item} key={index}>
                <div className={styles['item-image']}>
                  <img src={item.src} alt="notification" className={styles.icon} />
                </div>
                <div className={styles['item-content']}>
                  <p className={styles.norm}>{item.title}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Scrollbars>
    );

    return (
      <Sider
        {...menuSettings}
        className={isLightTheme ? `${styles.menu} ${styles.light} light` : styles.menu}
      >
        <div className={styles.logo}>
          <div className={styles.logoContainer}>
            <Link
              to={!checkUse?.check && '/'}
              onClick={() => this.onClickItem('/', 'LOGO')}
              className={styles['block-menu']}
            >
              <img
                alt="Clean UI React Admin Template"
                className={styles.image}
                src={info?.icon || '/images/home/note.svg'}
              />
              {!isMenuCollapsed && <h1 className={styles.title}>{info?.title || 'Điểm danh'}</h1>}
            </Link>
            {!isMenuCollapsed && (
              <Popover
                placement="rightTop"
                className={styles['popover-custom']}
                content={!checkUse?.check ? content : null}
                trigger="click"
                onClick={() => this.onClickItem()}
              >
                <span className="icon-toggle" />
              </Popover>
            )}
          </div>
        </div>
        <Scrollbars
          autoHeight
          autoHeightMax="calc(100vh - 100px)"
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
  info: PropTypes.objectOf(PropTypes.any),
  menu: PropTypes.arrayOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  checkUse: PropTypes.objectOf(PropTypes.any),
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
  info: {},
  menu: [],
  location: {},
  checkUse: {},
};
export default MenuLeft;
