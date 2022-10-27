import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
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
  holiday: absentStudentsAdd.holiday,
  branches: absentStudentsAdd.branches,
  classes: absentStudentsAdd.classes,
  categories: absentStudentsAdd.categories,
  menuLeftSchedules: menu.menuLeftSchedules,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      number: null,
      day: null,
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.loadCategories();
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
      dispatch,
      user,
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && get(params, 'id')) {
      this.formRef.current.setFieldsValue({
        ...details,
        startDate: moment(details?.startDate),
        endDate: moment(details?.endDate),
        classId: details?.student?.classStudent?.classId,
        branchId: details?.student?.classStudent?.class?.branchId,
      });
      if (isEmpty(details?.expectedDate)) {
        this.setStateData(
          () => ({
            number: details?.expectedDate,
          }));
      }
      if (user.role?.toUpperCase() !== variables.ROLES.PARENT && !user?.objectInfo?.id) {
        if (details?.student?.classStudent?.class?.branchId) {
          dispatch({
            type: 'absentStudentsAdd/GET_CLASSES',
            payload: {
              branch: details?.student?.classStudent?.class?.branchId,
            },
          });
        }
        if (details?.student?.classStudent?.classId) {
          dispatch({
            type: 'absentStudentsAdd/GET_STUDENTS',
            payload: {
              class: details?.student?.classStudent?.classId,
              classStatus: 'HAS_CLASS',
            },
          });
        }
      }
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
      type: 'absentStudentsAdd/GET_BRANCHES',
      payload: {},
    });
    dispatch({
      type: 'absentStudentsAdd/GET_HOLIDAY',
      payload: {},
    });
    dispatch({
      type: 'absentStudentsAdd/GET_CATEGORIES',
      payload: {},
    });
    if (user.role?.toUpperCase() === variables.ROLES.PARENT && user?.objectInfo?.id) {
      dispatch({
        type: 'absentStudentsAdd/GET_STUDENTS',
        payload: {
          parent: user.role?.toUpperCase() === variables.ROLES.PARENT && user?.objectInfo?.id,
          classStatus: 'HAS_CLASS',
        },
      });
    }
  };

  onChangeBranch = (branch) => {
    const { dispatch } = this.props;
    this.formRef.current.setFieldsValue({
      classId: null,
      studentId: null,
    });
    dispatch({
      type: 'absentStudentsAdd/GET_CLASSES',
      payload: {
        branch,
      },
    });
  };

  onChangeClass = (classId) => {
    const { dispatch } = this.props;
    this.formRef.current.setFieldsValue({
      studentId: null,
    });
    dispatch({
      type: 'absentStudentsAdd/GET_STUDENTS',
      payload: {
        class: classId,
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

    dispatch({
      type: params.id ? 'absentStudentsAdd/UPDATE' : 'absentStudentsAdd/ADD',
      payload: {
        ...values,
        id: params.id,
        status: 'PENDING',
        expectedDate: parseInt(values.expectedDate, 10),
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

  onChangeNumber = (e) => {
    const { day } = this.state;
    this.setStateData(
      () => ({
        number: e.target.value,
      }));
    if (day) {
      this.formRef.current.setFieldsValue({
        startDate: null,
        endDate: null,
      });
    }
  };

  getDatesInRange = (startDate, endDate) => {
    const date = new Date(startDate);
    const end = new Date(endDate);
    const monthRange = [];
    monthRange.push(moment(startDate).format('M'));
    if (moment(startDate).format('M') !== moment(endDate).format('M')) {
      monthRange.push(moment(endDate).format('M'));
    }
    const dates = [];
    end.setDate(end.getDate() + 1);

    while (date < end) {
      dates.push(moment(date).format('YYYY-MM-DD'));
      date.setDate(date.getDate() + 1);
    }
    return {
      dateRange: dates,
      monthRange,
    };
  }

  onChangeStartDay = (e) => {
    const {
      holiday
    } = this.props;
    const data = holiday?.map(i => (Helper.getDates(i?.startDate, i?.endDate)).map(k => moment(k).format("DD-MM-YYYY"))).flat(Infinity);
    const { number } = this.state;
    this.setStateData(
      () => ({
        day: e,
      }));
    let daysRemaining = number - 1;
    let totalAddDate = 1;

    const newDate = e.clone();

    while (daysRemaining > 0) {
      newDate.add(1, 'days');
      if (newDate.day() !== 6 && newDate.day() !== 0) {
        daysRemaining--;
        data.map((d) => {
          if (newDate.format('DD-MM-YYYY') === d) {
            daysRemaining++;
          }
        });
      }
      totalAddDate++;
    }

    this.formRef.current.setFieldsValue({
      endDate: moment(e).add(totalAddDate - 1, 'day'),
    });
    return { nextDate: newDate, totalAddDate };
  };

  render() {
    const {
      students,
      error,
      menuLeftSchedules,
      categories,
      loading: { effects },
      match: { params },
      branches,
      classes,
      holiday,
    } = this.props;
    const loading =
      effects['absentStudentsAdd/GET_DETAILS'] ||
      effects['absentStudentsAdd/GET_CATEGORIES'] ||
      effects['absentStudentsAdd/GET_DETAILS'];
    const loadingSubmit = effects['absentStudentsAdd/ADD'];
    const { number } = this.state;
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
            <Loading
              loading={loading}
              isError={error.isError}
              params={{ error, goBack: '/diem-danh/don-xin-phep-cho-be' }}
            >
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>

                <div className="row mt-3">
                  <div className="col-lg-4">
                    <FormItem
                      data={branches}
                      label="Cơ sở"
                      name="branchId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                      onChange={this.onChangeBranch}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormItem
                      data={classes}
                      label="Lớp"
                      name="classId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                      onChange={this.onChangeClass}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormItem
                      data={Helper.convertSelectUsers(students)}
                      label="Học sinh"
                      name="studentId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <FormItem
                      data={categories?.absentTypes || []}
                      label="Loại nghỉ phép"
                      name="absentTypeId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormItem
                      data={categories?.absentTypes || []}
                      label="Số ngày dự kiến"
                      name="expectedDate"
                      rules={[variables.RULES.EMPTY]}
                      onChange={this.onChangeNumber}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormItem
                      label="Nghỉ từ ngày"
                      name="startDate"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                      onChange={(event) => this.onChangeStartDay(event)}
                      disabledDate={(current) =>
                        Helper.disabledDateArray(current, holiday) ||
                        Helper.disabledDateWeekeend(current) ||
                        moment() > current
                      }
                      disabled={!number}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <FormItem
                      label="THỜI GIAN KẾT THÚC"
                      name="endDate"
                      type={variables.DATE_PICKER}
                      disabled
                    />
                  </div>
                  <div className="col-lg-8">
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
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  holiday: PropTypes.arrayOf(PropTypes.any),
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
  branches: [],
  classes: [],
  holiday: [],
};

export default Index;