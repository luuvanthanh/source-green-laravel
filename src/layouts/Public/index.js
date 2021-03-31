import React from 'react';
import { Layout } from 'antd';
import { withRouter } from 'umi';
import styles from './style.module.scss';
import TopBar from '@/components/LayoutComponents/Home/TopBar';

@withRouter
class LoginLayout extends React.PureComponent {
  render() {
    const { children } = this.props;

    return (
      <Layout>
        <Layout.Header className={styles.header}>
          <TopBar />
        </Layout.Header>
        <Layout.Content className={styles.wrapper}>
          <div
            className={styles.content}
            style={{
              backgroundImage: `url('images/bg.png')`,
            }}
          >
            {children}
          </div>
        </Layout.Content>
      </Layout>
    );
  }
}

export default LoginLayout;
