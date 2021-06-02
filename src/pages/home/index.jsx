import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'umi';
import PropTypes from 'prop-types';
import { variables } from '@/utils';
import styles from './index.scss';
import HomePage from './homePage';
import Application from './application';

@connect(({ user, loading }) => ({ user, loading }))
class Index extends PureComponent {
  render() {
    const {
      user: { user },
    } = this.props;

    if (user?.role?.toUpperCase() === variables.ROLES.PRINCIPAL) {
      return <HomePage />;
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
  user: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  user: {},
};

export default Index;
