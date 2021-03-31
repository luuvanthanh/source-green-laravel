import React from 'react';
import { Layout } from 'antd';
import { withRouter } from 'umi';
import styles from './style.module.scss';

@withRouter
class LoginLayout extends React.PureComponent {
  render() {
    const { children } = this.props;

    return (
      <Layout>
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
