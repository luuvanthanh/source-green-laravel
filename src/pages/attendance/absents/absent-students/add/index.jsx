import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, message } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import moment from 'moment';
import { get, isEmpty } from 'lodash';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';
import PropTypes from 'prop-types';

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
const mapStateToProps = ({ menu, absentStudentsAdd, loading, user }) => ({
  loading,
  user: user.user,
  error: absentStudentsAdd.error,
  details: absentStudentsAdd.details,
  students: absentStudentsAdd.students,
  categories: absentStudentsAdd.categories,
  menuLeftSchedules: menu.menuLeftSchedules,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {};
    setIsMounted(true);
  }

  componentDidMount() {
    this.loadCategories();
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && get(params, 'id')) {
      this.formRef.current.setFieldsValue({
        ...details,
        startDate: moment(details?.startDate),
        endDate: moment(details?.endDate),
      });
    }
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

  loadCategories = () => {
    const {
      dispatch,
      user,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'absentStudentsAdd/GET_DETAILS',
        payload: {
          ...params,
        },
      });
    }
    dispatch({
      type: 'absentStudentsAdd/GET_CATEGORIES',
      payload: {},
    });
    dispatch({
      type: 'absentStudentsAdd/GET_STUDENTS',
      payload: {
        parent: user.role?.toUpperCase() === variables.ROLES.PARENT && user?.objectInfo?.id,
        classStatus: 'HAS_CLASS',
      },
    });
  };

  onFinish = (values) => {
    const {
      user,
      dispatch,
      match: { params },
    } = this.props;
    if (!user?.objectInfo?.id) {
      message.error('Vui lòng đăng nhập tài khoản quản trị nhân sự');
      return;
    }
    dispatch({
      type: params.id ? 'absentStudentsAdd/UPDATE' : 'absentStudentsAdd/ADD',
      payload: {
        ...values,
        id: params.id,
        status: 'PENDING',
        employeeId: user?.objectInfo?.id,
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
  };

  render() {
    const {
      students,
      error,
      menuLeftSchedules,
      categories,
      loading: { effects },
      match: { params },
    } = this.props;
    const loading =
      effects['absentStudentsAdd/GET_DETAILS'] ||
      effects['absentStudentsAdd/GET_CATEGORIES'] ||
      effects['absentStudentsAdd/GET_STUDENTS'] ||
      effects['absentStudentsAdd/GET_DETAILS'];
    const loadingSubmit = effects['absentStudentsAdd/ADD'];
    return (
      <>
        <Breadcrumbs
          last={params.id ? 'Chỉnh sửa nghỉ phép cho bé' : 'Tạo nghỉ phép cho bé'}
          menu={menuLeftSchedules}
        />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          ref={this.formRef}
          onFinish={this.onFinish}
        >
          <div className={styles['content-form']}>
            <Loading loading={loading} isError={error.isError} params={{ error }}>
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      data={categories?.absentTypes || []}
                      label="LOẠI NGHỈ PHÉP"
                      name="absentTypeId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      data={Helper.convertSelectUsers(students)}
                      label="HỌC SINH"
                      name="studentId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <FormItem
                      label="THỜI GIAN BẮT ĐẦU"
                      name="startDate"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                      disabledDate={(current) => Helper.disabledDateFrom(current, this.formRef)}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      label="THỜI GIAN KẾT THÚC"
                      name="endDate"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                      disabledDate={(current) => Helper.disabledDateTo(current, this.formRef)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <FormItem
                      data={categories?.absentReasons || []}
                      label="LÝ DO NGHỈ PHÉP"
                      name="absentReasonId"
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
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
                  loading={loadingSubmit}
                >
                  HỦY
                </Button>
                <Button
                  color="green"
                  icon="save"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit}
                >
                  LƯU
                </Button>
              </div>
            </Loading>
          </div>
        </Form>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
  students: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  menuLeftSchedules: PropTypes.arrayOf(PropTypes.any),
  categories: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  user: {},
  students: [],
  error: {},
  menuLeftSchedules: [],
  categories: {},
  details: {},
};

export default Index;
