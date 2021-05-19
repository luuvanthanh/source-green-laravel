import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'umi';
import PropTypes from 'prop-types';
import styles from './index.scss';
import { variables } from '@/utils';
import HomePage from './homePage';
import Application from './application';

@connect(({ user, loading }) => ({ user, loading }))

class Index extends PureComponent {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {
      user: { user }
    } = this.props;

    if (user?.role?.toUpperCase() === variables.ROLES.PRINCIPAL) {
      return (
        <HomePage />
      )
    }
    return (
      <div className={styles.block}>
        <Helmet title="Trang Chủ" />
        <Application />
      </div>
    );
  }
}

Index.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default Index;
