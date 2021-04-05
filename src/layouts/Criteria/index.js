import React from 'react';
import { Layout } from 'antd';
import { connect, withRouter } from 'umi';
import classNames from 'classnames';
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
  menuLeftCriteria: menu.menuLeftCriteria,
});

@withRouter
@connect(mapStateToProps)
class MainLayout extends React.PureComponent {
  render() {
    const {
      children,
      isMenuTop,
      isBorderless,
      isFixedWidth,
      isMenuShadow,
      isSquaredBorders,
      menuLeftCriteria,
    } = this.props;
    return (
      <Layout
        className={classNames({
          settings__borderLess: isBorderless,
          settings__squaredBorders: isSquaredBorders,
          settings__fixedWidth: isFixedWidth,
          settings__menuShadow: isMenuShadow,
          settings__menuTop: isMenuTop,
        })}
      >
        <Menu
          menu={menuLeftCriteria}
          info={{
            icon: '/images/home/spreadsheet.svg',
            title: 'Tiêu chí đánh giá',
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
  dispatch: PropTypes.any.isRequired,
  children: PropTypes.any,
  isBorderless: PropTypes.bool,
  isSquaredBorders: PropTypes.bool,
  isFixedWidth: PropTypes.bool,
  isMenuShadow: PropTypes.bool,
  isMenuTop: PropTypes.bool,
  isMenuCollapsed: PropTypes.bool,
};

MainLayout.defaultProps = {
  dispatch: {},
  children: '',
  isBorderless: false,
  isSquaredBorders: false,
  isFixedWidth: false,
  isMenuShadow: false,
  isMenuTop: false,
  isMenuCollapsed: false,
};

export default MainLayout;
