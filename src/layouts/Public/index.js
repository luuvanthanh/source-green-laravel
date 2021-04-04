import React from 'react';
import { Layout } from 'antd';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';
import styles from './style.module.scss';
import TopBar from '@/components/LayoutComponents/Home/TopBar';

const mapStateToProps = ({ settings }) => ({
  background: settings.background,
});

@withRouter
@connect(mapStateToProps)
class PublicLayout extends React.PureComponent {
  render() {
    console.log('121')
    const { children, background } = this.props;
    return (
      <Layout>
        <Layout.Header className={styles.header}>
          <TopBar />
        </Layout.Header>
        <Layout.Content className={styles.wrapper}>
          <div
            className={styles.content}
            style={{
              backgroundImage: background ? `url(${background})` : `url('images/bg.png')`,
            }}
          >
            {children}
          </div>
        </Layout.Content>
      </Layout>
    );
  }
}

PublicLayout.propTypes = {
  children: PropTypes.objectOf(PropTypes.any),
  background: PropTypes.string,
};

PublicLayout.defaultProps = {
  children: null,
  background: '',
};

export default PublicLayout;
