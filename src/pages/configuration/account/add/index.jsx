import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, isEmpty, head } from 'lodash';
import Text from '@/components/CommonComponent/Text';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import variablesModules from '../../utils/variables';
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
  roles: configurationAccountAdd.roles,
  parents: configurationAccountAdd.parents,
  employees: configurationAccountAdd.employees,
  menuConfiguration: menu.menuConfiguration,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      type: null,
    };
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
    dispatch({
      type: 'configurationAccountAdd/GET_ROLES',
      payload: params,
    });
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

  onChangeType = (type) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    this.setStateData(
      {
        type,
      },
      () => {
        if (type === variablesModules.EMPLOYEES) {
          dispatch({
            type: 'configurationAccountAdd/GET_EMPLOYEES',
            payload: params,
          });
        } else {
          dispatch({
            type: 'configurationAccountAdd/GET_PARENTS',
            payload: params,
          });
        }
      },
    );
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { type } = this.state;
    dispatch({
      type:
        type === variablesModules.EMPLOYEES
          ? 'configurationAccountAdd/ADD_EMPLOYEES_ACCOUNTS'
          : 'configurationAccountAdd/ADD_PARENTS_ACCOUNTS',
      payload: {
        parentId: values.parentId,
        employeeId: values.parentId,
        account: {
          userName: values.parentId,
          password: values.password,
          email: values.email,
          roleId: values.roleId,
        },
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              this.formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  render() {
    const {
      roles,
      parents,
      employees,
      error,
      loading: { effects },
      menuConfiguration,
    } = this.props;
    const { type } = this.state;
    const loading = effects['configurationAccountAdd/GET_DETAILS'];
    const loadingSubmit =
      effects['configurationAccountAdd/ADD_EMPLOYEES_ACCOUNTS'] ||
      effects['configurationAccountAdd/ADD_PARENTS_ACCOUNTS'];
    return (
      <>
        <Breadcrumbs last="Tạo tài khoản" menu={menuConfiguration} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          colon={false}
          onFinish={this.onFinish}
          ref={this.formRef}
        >
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <div className={classnames(styles['content-form'], 'pt-0')}>
              <div className={styles['content-children']}>
                <Text color="dark" size="large-medium">
                  Thông tin tài khoản
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      label="Tên tài khoản"
                      name="userName"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      label="Email"
                      name="email"
                      rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}
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
                  <div className="col-lg-6">
                    <FormItem
                      data={roles}
                      label="Vai trò"
                      name="roleId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                </div>
                <hr className={styles.dot} />
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      data={[
                        {
                          id: 'PARENT',
                          name: 'Phụ huynh',
                        },
                        {
                          id: 'EMPLOYEES',
                          name: 'Nhân viên',
                        },
                      ]}
                      label="Liên hệ với hồ sơ đối tượng"
                      name="type"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                      onChange={this.onChangeType}
                    />
                  </div>
                  {type === variablesModules.PARENT && (
                    <div className="col-lg-6">
                      <FormItem
                        data={parents.map((item) => ({
                          id: item.id,
                          name: item.fullName,
                        }))}
                        label="Phụ huynh"
                        name="parentId"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                      />
                    </div>
                  )}
                  {type === variablesModules.EMPLOYEES && (
                    <div className="col-lg-6">
                      <FormItem
                        data={employees.map((item) => ({
                          id: item.id,
                          name: item.fullName,
                        }))}
                        label="Nhân viên"
                        name="employeeId"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                      />
                    </div>
                  )}
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
