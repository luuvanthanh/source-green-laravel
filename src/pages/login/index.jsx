import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { Helmet } from 'react-helmet';
import { connect } from 'umi';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import styles from './index.scss';

const cookies = new Cookies();
@connect(({ user, loading }) => ({ user, loading }))
class Index extends PureComponent {
  /**
   * Function Submit Form Login
   * @param {object} values values of form login
   * @param {function} dispatch Call effects model login
   */
  onFinish = (values) => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    cookies.remove('access_token', { path: '/' });
    cookies.remove('token_type', { path: '/' });
    dispatch({
      type: 'user/login',
      payload: {
        ...values,
        grant_type: 'password',
        scope: 'Erp',
        redirect: query.redirect,
      },
    });
  };

  render() {
    const {
      loading: { effects },
    } = this.props;
    const loading = effects['user/login'];
    return (
      <div>
        <Helmet title="Login" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Đăng nhập</strong>
                  </h4>
                  <br />
                  <Form
                    hideRequiredMark
                    initialValues={{ password: '1q2w3E*', username: 'admin' }}
                    layout="vertical"
                    onFinish={this.onFinish}
                  >
                    <FormItem
                      label="TÊN ĐĂNG NHẬP"
                      name="username"
                      rules={[variables.RULES.EMPTY_INPUT]}
                      type={variables.INPUT}
                    />
                    <FormItem
                      label="PASSWORD"
                      name="password"
                      rules={[variables.RULES.EMPTY_INPUT]}
                      type={variables.INPUT_PASSWORD}
                    />
                    <div className="form-actions">
                      <Button color="primary" htmlType="submit" loading={loading}>
                        Đăng nhập
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
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
