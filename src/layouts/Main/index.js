import React from 'react';
import { Layout } from 'antd';
import { connect, withRouter } from 'umi';
import classNames from 'classnames';
import TopBar from '@/components/LayoutComponents/TopBar';
import Menu from '@/components/LayoutComponents/Menu';
import Settings from '@/components/LayoutComponents/Settings';
import PropTypes from 'prop-types';
import styles from '@/assets/styles/Common/common.scss';

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
class MainLayout extends React.PureComponent {
  componentDidMount() {
    this.loadboGroups();
  }

  /**
   * Function get loadboGroups
   */
  loadboGroups = async () => {
    await this.props.dispatch({
      type: 'categories/GET_BUSINESS_OBJECT_GROUP',
    });
  };

  render() {
    const {
      children,
      isBorderless,
      isSquaredBorders,
      isFixedWidth,
      isMenuShadow,
      isMenuTop,
      isMenuCollapsed,
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
        <Menu />
        <Settings />
        <Layout>{children}</Layout>
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
