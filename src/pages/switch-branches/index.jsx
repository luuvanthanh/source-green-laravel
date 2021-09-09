import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { Helmet } from 'react-helmet';
import { connect } from 'umi';
import classnames from 'classnames';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import PropTypes from 'prop-types';
import styles from './index.scss';

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
    dispatch({
      type: 'user/SWITCH_BRANCHES',
      payload: {
        ...values,
        redirect: query.redirect,
      },
    });
  };

  render() {
    const {
      loading: { effects },
      user,
    } = this.props;
    const loading = effects['user/SWITCH_BRANCHES'];
    return (
      <div className={classnames(styles.block, 'login-container')}>
        <Helmet title="Switch Branches" />
        <div className={styles.inner}>
          <div className={styles.form}>
            <div
              className={classnames(styles['logo-container'], 'd-flex', 'justify-content-center')}
            >
              <img src="images/login/logo.png" alt="imageLogin" className={styles.logo} />
            </div>
            <Form
              hideRequiredMark
              initialValues={{
                branchId: user?.defaultBranch?.id,
              }}
              layout="vertical"
              onFinish={this.onFinish}
            >
              <FormItem
                data={user?.branchs?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                name="branchId"
                type={variables.RADIO}
                className="input-login"
              />
              <div className="form-actions">
                <Button
                  color="success"
                  htmlType="submit"
                  className={styles.button}
                  loading={loading}
                >
                  XÁC NHẬN CƠ SỞ
                </Button>
              </div>
            </Form>
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
  user: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
  user: {},
};

export default Index;
