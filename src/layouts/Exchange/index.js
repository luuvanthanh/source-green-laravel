import React from 'react';
import { Layout } from 'antd';
import { connect, withRouter } from 'umi';
import classnames from 'classnames';
import Menu from '@/components/LayoutComponents/Menu';
import Settings from '@/components/LayoutComponents/Settings';
import PropTypes from 'prop-types';
import TopBar from '@/components/LayoutComponents/TopBar';

const mapStateToProps = ({ settings, menu }) => ({
  isBorderless: settings.isBorderless,
  isSquaredBorders: settings.isSquaredBorders,
  isFixedWidth: settings.isFixedWidth,
  isMenuShadow: settings.isMenuShadow,
  isMenuTop: settings.isMenuTop,
  isMenuCollapsed: settings.isMenuCollapsed,
  menuData: menu.menuLeftCommunications,
});

@withRouter
@connect(mapStateToProps)
class MainLayout extends React.PureComponent {
  render() {
    const {
      children,
      isBorderless,
      isSquaredBorders,
      isFixedWidth,
      isMenuShadow,
      isMenuTop,
      menuData,
    } = this.props;
    return (
      <Layout
        className={classnames({
          settings__borderLess: isBorderless,
          settings__squaredBorders: isSquaredBorders,
          settings__fixedWidth: isFixedWidth,
          settings__menuShadow: isMenuShadow,
          settings__menuTop: isMenuTop,
        })}
      >
        <Menu
          menu={menuData}
          info={{
            icon: '/images/home/speech.svg',
            title: 'Trao đổi',
          }}
        />
        <Settings />
        <Layout>
          <Layout.Header>
            <TopBar />
          </Layout.Header>
          {children}
        </Layout>
      </Layout>
    );
  }
}

MainLayout.propTypes = {
  children: PropTypes.any,
  isBorderless: PropTypes.bool,
  isSquaredBorders: PropTypes.bool,
  isFixedWidth: PropTypes.bool,
  isMenuShadow: PropTypes.bool,
  isMenuTop: PropTypes.bool,
  menuData: PropTypes.arrayOf(PropTypes.any),
};

MainLayout.defaultProps = {
  children: '',
  isBorderless: false,
  isSquaredBorders: false,
  isFixedWidth: false,
  isMenuShadow: false,
  isMenuTop: false,
  menuData: [],
};

export default MainLayout;
