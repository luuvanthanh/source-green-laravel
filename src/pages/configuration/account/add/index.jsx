import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import stylesModule from '@/assets/styles/Modules/Schedules/styles.module.scss';
import { DeleteOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import moment from 'moment';
import { get, isEmpty } from 'lodash';
import Text from '@/components/CommonComponent/Text';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

let isMounted = true;
/**
 * Set isMounted
 * @param {boolean} value
 * @returns {boolean} value of isMounted
 */
const setIsMounted = (value = true) => {
  isMounted = value;
  return isMounted;
};
/**
 * Get isMounted
 * @returns {boolean} value of isMounted
 */
const getIsMounted = () => isMounted;
const mapStateToProps = ({ configurationAccountAdd, loading, menu }) => ({
  loading: loading,
  error: configurationAccountAdd.error,
  details: configurationAccountAdd.details,
  menuConfiguration: menu.menuConfiguration,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {};
    setIsMounted(true);
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  /**
   * Set state properties
   * @param {object} data the data input
   * @param {function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof setStateData
   */
  setStateData = (state, callback) => {
    if (!getIsMounted()) {
      return;
    }
    this.setState(state, callback);
  };

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (get(params, 'id')) {
      dispatch({
        type: 'configurationAccountAdd/GET_DETAILS',
        payload: get(params, 'id'),
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && get(params, 'id')) {
      this.formRef.current.setFieldsValue({
        ...details,
      });
    }
  }

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (get(params, 'id')) {
      dispatch({
        type: 'configurationAccountAdd/UPDATE',
        payload: {
          ...values,
          id: get(params, 'id'),
        },
        callback: (response, error) => {
          if (response) {
            history.goBack();
          }
          if (error) {
            if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
              error.data.errors.forEach((item) => {
                this.formRef.current.setFields([
                  {
                    name: get(item, 'source.pointer'),
                    errors: [get(item, 'detail')],
                  },
                ]);
              });
            }
          }
        },
      });
    } else {
      dispatch({
        type: 'configurationAccountAdd/ADD',
        payload: {
          ...values,
        },
        callback: (response, error) => {
          if (response) {
            history.goBack();
          }
          if (error) {
            if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
              error.data.errors.forEach((item) => {
                this.formRef.current.setFields([
                  {
                    name: get(item, 'source.pointer'),
                    errors: [get(item, 'detail')],
                  },
                ]);
              });
            }
          }
        },
      });
    }
  };

  render() {
    const {
      error,
      loading: { effects },
      menuConfiguration,
    } = this.props;
    const loading = effects['configurationAccountAdd/GET_DETAILS'];
    const loadingSubmit =
      effects['configurationAccountAdd/ADD'] || effects['configurationAccountAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs last="Tạo tài khoản" menu={menuConfiguration} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          initialValues={{
            time: [{}],
          }}
          colon={false}
          onFinish={this.onFinish}
          ref={this.formRef}
        >
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <div className={styles['content-form']}>
              <div className="d-flex justify-content-between">
                <Text color="dark">TẠO MỚI TÀI KHOẢN</Text>
              </div>
              <div className={styles['content-children']}>
                <Text color="dark" size="large-medium">
                  Thông tin tài khoản
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      label="Tên tài khoản"
                      name="username"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      label="Mật khẩu"
                      name="password"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT_PASSWORD}
                    />
                  </div>
                </div>
                <hr className={styles.dot} />
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      data={[]}
                      label="Vai trò"
                      name="role_id"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      data={[]}
                      label="Liên hệ với hồ sơ đối tượng"
                      name="obId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                </div>
                <hr className={styles.dot} />
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <FormItem
                      label="MÔ TẢ"
                      name="description"
                      rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                      type={variables.TEXTAREA}
                    />
                  </div>
                </div>
              </div>
              <div className={classnames('d-flex', 'justify-content-center', 'mt-4')}>
                <Button
                  color="gray"
                  icon="prev"
                  onClick={() => history.goBack()}
                  size="large"
                  className="mr-3"
                  loading={loadingSubmit || loading}
                >
                  HỦY
                </Button>
                <Button
                  color="green"
                  icon="save"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit || loading}
                >
                  LƯU
                </Button>
              </div>
            </div>
          </Loading>
        </Form>
      </>
    );
  }
}

Index.propTypes = {};

export default Index;
