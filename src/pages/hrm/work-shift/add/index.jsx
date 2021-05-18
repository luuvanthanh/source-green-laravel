import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, notification } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { isEmpty, get, omit } from 'lodash';
import Loading from '@/components/CommonComponent/Loading';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import moment from 'moment';

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
const mapStateToProps = ({ menu, loading, workShiftsAdd, user }) => ({
  menuData: menu.menuLeftHRM,
  loading,
  details: workShiftsAdd.details,
  error: workShiftsAdd.error,
  divisions: workShiftsAdd.divisions,
  shifts: workShiftsAdd.shifts,
  user: user.user,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      shiftDetail: [],
    };
    setIsMounted(true);
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'workShiftsAdd/GET_DETAILS',
        payload: params,
      });
    }
    this.loadCategories();
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && params?.id) {
      this.formRef.current.setFieldsValue({
        ...details,
        startDate: moment(details.startDate),
        endDate: moment(details.endDate),
      });
      this.onSetShiftDetail(details.shift);
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
    const { dispatch } = this.props;
    dispatch({
      type: 'workShiftsAdd/GET_DIVISIONS',
      payload: {},
    });
    dispatch({
      type: 'workShiftsAdd/GET_SHIFTS',
      payload: {},
    });
  };

  onSetShiftDetail = (shiftItem) => {
    this.setStateData(
      {
        shiftDetail: shiftItem.shiftDetail,
      },
      () => {
        this.formRef.current.setFieldsValue({
          timeIn0:
            get(shiftItem, 'shiftDetail[0].startTime') &&
            moment(get(shiftItem, 'shiftDetail[0].startTime'), variables.DATE_FORMAT.TIME_FULL),
          timeLate0:
            get(shiftItem, 'shiftDetail[0].afterStart') &&
            moment(get(shiftItem, 'shiftDetail[0].afterStart'), variables.DATE_FORMAT.TIME_FULL),
          timeIn1:
            get(shiftItem, 'shiftDetail[1].startTime') &&
            moment(get(shiftItem, 'shiftDetail[1].startTime'), variables.DATE_FORMAT.TIME_FULL),
          timeLate1:
            get(shiftItem, 'shiftDetail[1].beforeEnd') &&
            moment(get(shiftItem, 'shiftDetail[1].beforeEnd'), variables.DATE_FORMAT.TIME_FULL),
        });
      },
    );
  };

  onChangeShift = (value) => {
    const { shifts } = this.props;
    const shiftItem = shifts.find((item) => item.id === value);
    this.setStateData(
      {
        shiftDetail: shiftItem.shiftDetail,
      },
      () => {
        this.formRef.current.setFieldsValue({
          timeIn0:
            get(shiftItem, 'shiftDetail[0].startTime') &&
            moment(get(shiftItem, 'shiftDetail[0].startTime'), variables.DATE_FORMAT.TIME_FULL),
          timeLate0:
            get(shiftItem, 'shiftDetail[0].afterStart') &&
            moment(get(shiftItem, 'shiftDetail[0].afterStart'), variables.DATE_FORMAT.TIME_FULL),
          timeIn1:
            get(shiftItem, 'shiftDetail[1].startTime') &&
            moment(get(shiftItem, 'shiftDetail[1].startTime'), variables.DATE_FORMAT.TIME_FULL),
          timeLate1:
            get(shiftItem, 'shiftDetail[1].beforeEnd') &&
            moment(get(shiftItem, 'shiftDetail[1].beforeEnd'), variables.DATE_FORMAT.TIME_FULL),
        });
      },
    );
  };

  onFinish = (values) => {
    const {
      user,
      dispatch,
      match: { params },
    } = this.props;
    if (!user?.objectInfo?.id) {
      notification.error({
        message: 'THÔNG BÁO',
        description: 'Tài khoản không phải là nhân viên, vui lòng kiểm tra lại',
      });
      return;
    }
    const payload = {
      ...omit(values, 'timeIn0', 'timeIn1', 'timeLate0', 'timeLate1'),
      employeeCreateId: user?.objectInfo?.id,
      id: params.id,
    };
    dispatch({
      type: params.id ? 'workShiftsAdd/UPDATE' : 'workShiftsAdd/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.data?.errors && !isEmpty(error?.data?.errors)) {
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
      error,
      menuData,
      shifts,
      divisions,
      match: { params },
      loading: { effects },
    } = this.props;
    const { shiftDetail } = this.state;
    const loadingSubmit = effects['workShiftsAdd/ADD'] || effects['workShiftsAdd/UPDATE'];
    const loading =
      effects['workShiftsAdd/GET_DETAILS'] ||
      effects['workShiftsAdd/GET_DIVISIONS'] ||
      effects['workShiftsAdd/GET_SHIFTS'];
    return (
      <>
        <Breadcrumbs last={params.id ? 'Chỉnh sửa' : 'Thêm mới'} menu={menuData} />
        <div className="pl20 pr20">
          <div className="row">
            <div className="offset-lg-2 col-lg-8">
              <Form
                className={styles['layout-form']}
                layout="vertical"
                colon={false}
                ref={this.formRef}
                initialValues={{
                  endDate: moment().endOf('years'),
                }}
                onFinish={this.onFinish}
              >
                <div className={styles['content-form']}>
                  <Loading
                    loading={loading}
                    isError={error.isError}
                    params={{ error, type: 'container' }}
                  >
                    <div className={classnames(styles['content-children'], 'mt10')}>
                      <Text color="dark" size="large-medium">
                        Thông tin phân ca
                      </Text>
                      <div className="row mt-3">
                        <div className="col-lg-6">
                          <FormItem
                            data={divisions}
                            label="Bộ phận"
                            name="divisionId"
                            rules={[variables.RULES.EMPTY]}
                            type={variables.SELECT}
                          />
                        </div>
                        <div className="col-lg-6">
                          <FormItem
                            data={shifts.map((item) => ({
                              id: item.id,
                              name: item.name || item.shiftCode,
                            }))}
                            label="Ca làm việc"
                            name="shiftId"
                            type={variables.SELECT}
                            rules={[variables.RULES.EMPTY]}
                            onChange={this.onChangeShift}
                          />
                        </div>
                      </div>
                      {shiftDetail.map((item, index) => (
                        <div className="row" key={index}>
                          <div className="col-lg-6">
                            <FormItem
                              label={index === 0 ? 'Chấm công vào' : 'Chấm công ra'}
                              name={`timeIn${index}`}
                              type={variables.TIME_PICKER}
                              disabled
                            />
                          </div>
                          <div className="col-lg-6">
                            <FormItem
                              label={
                                index === 0
                                  ? 'Thời gian đi trễ (không vượt quá)'
                                  : 'Thời gian về sớm (không vượt quá)'
                              }
                              name={`timeLate${index}`}
                              disabled
                              type={variables.TIME_PICKER}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="row">
                        <div className="col-lg-6">
                          <FormItem
                            label="Ngày bắt đầu"
                            name="startDate"
                            rules={[variables.RULES.EMPTY]}
                            type={variables.DATE_PICKER}
                            disabledDate={(current) =>
                              Helper.disabledDateFrom(current, this.formRef)
                            }
                          />
                        </div>
                        <div className="col-lg-6">
                          <FormItem
                            label="Ngày kết thúc"
                            name="endDate"
                            rules={[variables.RULES.EMPTY]}
                            type={variables.DATE_PICKER}
                            disabledDate={(current) => Helper.disabledDateTo(current, this.formRef)}
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
                        htmlType="submit"
                        icon="save"
                        size="large"
                        loading={loadingSubmit}
                      >
                        LƯU
                      </Button>
                    </div>
                  </Loading>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Index.propTypes = {};

export default Index;
