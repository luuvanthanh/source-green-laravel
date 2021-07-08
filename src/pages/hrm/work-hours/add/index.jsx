import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import stylesModule from '@/assets/styles/Modules/Schedules/styles.module.scss';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import PropTypes from 'prop-types';
import { get, isEmpty, uniqBy } from 'lodash';
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
const mapStateToProps = ({ workHoursAdd, loading, menu }) => ({
  dataStores: workHoursAdd.dataStores,
  loading,
  error: workHoursAdd.error,
  details: workHoursAdd.details,
  categories: workHoursAdd.categories,
  absentTypes: workHoursAdd.absentTypes,
  menuData: menu.menuLeftHRM,
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
        type: 'workHoursAdd/GET_DETAILS',
        payload: get(params, 'id'),
      });
    }
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
        date: moment(details.date),
        hours: details?.hours?.map((item) => {
          const inTime = moment(item.in, variables.DATE_FORMAT.TIME_FULL);
          const outTime = moment(item.out, variables.DATE_FORMAT.TIME_FULL);
          return {
            in: inTime,
            out: outTime,
          };
        }),
      });
    }
  }

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workHoursAdd/GET_CATEGORIES',
      payload: {},
    });
    dispatch({
      type: 'workHoursAdd/GET_ABSENT_TYPES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: params.id ? 'workHoursAdd/UPDATE' : 'workHoursAdd/ADD',
      payload: {
        ...values,
        employeeCreate: values.employeeId,
        date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.date,
            targetValue: '23:59:59',
          }),
          isUTC: false,
        }),
        hours: values.hours.map((item) => ({
          in: moment(item.in).format(variables.DATE_FORMAT.HOUR),
          out: moment(item.out).format(variables.DATE_FORMAT.HOUR),
        })),
        id: params.id,
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

  convertSelectShift = (items) => {
    if (!isEmpty(items)) {
      return items.map((item) => ({
        id: item.id,
        name: `${item.shiftCode} (${item.shiftDetail
          .map((itemShift) => `${itemShift.startTime} - ${itemShift.endTime}`)
          .join(', ')})`,
      }));
    }
    return [];
  };

  onChange = (value) => {
    const { categories } = this.props;
    const shift = categories.shifts.find((item) => item.id === value);
    if (shift) {
      this.formRef.current.setFieldsValue({
        time: shift.shiftDetail,
      });
    }
  };

  onChangeTimePicker = (timeChoose, index, type = 'in') => {
    if (this.formRef.current) {
      const { hours } = this.formRef.current.getFieldsValue();
      this.formRef.current.setFieldsValue({
        hours: hours.map((item, indexTime) => {
          if (indexTime === index && type === 'in') {
            return {
              ...item,
              in: timeChoose,
            };
          }
          if (indexTime === index && type === 'out') {
            return {
              ...item,
              out: timeChoose,
            };
          }
          return item;
        }),
      });
    }
  };

  disabledHours = (index, key = 'in') => {
    const { getFieldsValue } = this.formRef.current;
    const { hours } = getFieldsValue();
    const itemLast = hours.find((item, indexTime) => indexTime === index);
    if (get(itemLast, 'in') || get(itemLast, 'out')) {
      const arrayHours = [];
      const startTime = itemLast.in ? parseInt(moment(itemLast.in).format('H'), 10) : null;
      const endTime = itemLast.out ? parseInt(moment(itemLast.out).format('H'), 10) : null;
      if (key === 'out') {
        for (let i = 0; i < startTime; i += 1) {
          arrayHours.push(i);
        }
        return uniqBy(arrayHours);
      }
      if (key === 'in') {
        for (let i = endTime + 1; i <= 23; i += 1) {
          arrayHours.push(i);
        }
        return uniqBy(arrayHours);
      }

      return uniqBy(arrayHours);
    }
    return [];
  };

  disabledMinutes = (selectedHour, index, type = 'in') => {
    const { getFieldsValue } = this.formRef.current;
    const { hours } = getFieldsValue();
    const itemLast = hours.find((item, indexTime) => indexTime === index);
    if (get(itemLast, 'in') && get(itemLast, 'out')) {
      const arrayHours = [];
      const startTime = parseInt(moment(itemLast.in).format('H'), 10);
      const endTime = parseInt(moment(itemLast.out).format('H'), 10);
      const startTimeMinutes = parseInt(moment(itemLast.in).format('m'), 10);
      const endTimeMinutes = parseInt(moment(itemLast.out).format('m'), 10);
      if (selectedHour !== endTime) {
        return [];
      }
      if (type === 'out') {
        if (startTime === endTime) {
          for (let i = 0; i <= startTimeMinutes; i += 1) {
            arrayHours.push(i);
          }
        }
      }
      if (type === 'in') {
        if (startTime === endTime) {
          for (let i = endTimeMinutes; i < 59; i += 1) {
            arrayHours.push(i);
          }
        }
      }

      return uniqBy(arrayHours);
    }
    return [];
  };

  render() {
    const {
      error,
      menuData,
      categories,
      absentTypes,
      loading: { effects },
    } = this.props;
    const loading = effects['workHoursAdd/GET_DETAILS'];
    const loadingSubmit = effects['workHoursAdd/ADD'] || effects['workHoursAdd/UPDATE'];
    return (
      <>
        <Helmet title="Tạo mới phiếu ĐK giờ làm thêm" />
        <Breadcrumbs last="Tạo mới phiếu ĐK giờ làm thêm" menu={menuData} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          initialValues={{
            hours: [{}],
          }}
          colon={false}
          onFinish={this.onFinish}
          ref={this.formRef}
        >
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <div className={styles['content-form']}>
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      data={absentTypes}
                      label="Loại công"
                      name="absentTypeId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      data={Helper.convertSelectUsers(categories.users)}
                      label="Nhân viên"
                      name="employeeId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <FormItem
                      label="Ngày áp dụng"
                      name="date"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.DATE_PICKER}
                      disabledDate={Helper.disabledDate}
                    />
                  </div>
                </div>
                <Form.List name="hours">
                  {(fields) => (
                    <div>
                      {fields.map((field, index) => (
                        <div
                          className={classnames(
                            'row',
                            stylesModule['form-item'],
                            stylesModule['form-item-advance'],
                          )}
                          key={field.key}
                        >
                          <div className="col-lg-6">
                            <FormItem
                              onSelect={(value) => this.onChangeTimePicker(value, index, 'in')}
                              label="Thời gian từ"
                              name={[field.name, 'in']}
                              fieldKey={[field.fieldKey, 'in']}
                              rules={[variables.RULES.EMPTY]}
                              type={variables.TIME_PICKER}
                              disabledHours={() => this.disabledHours(index)}
                              disabledMinutes={(selectedHour) =>
                                this.disabledMinutes(selectedHour, index)
                              }
                            />
                          </div>
                          <div className="col-lg-6">
                            <FormItem
                              onSelect={(value) => this.onChangeTimePicker(value, index, 'out')}
                              label="Thời gian đến"
                              name={[field.name, 'out']}
                              fieldKey={[field.fieldKey, 'out']}
                              rules={[variables.RULES.EMPTY]}
                              type={variables.TIME_PICKER}
                              disabledHours={() => this.disabledHours(index, 'out')}
                              disabledMinutes={(selectedHour) =>
                                this.disabledMinutes(selectedHour, index, 'out')
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Form.List>
                <div className="row">
                  <div className="col-lg-12">
                    <FormItem
                      label="Lý do"
                      name="reason"
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

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  categories: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  menuData: PropTypes.arrayOf(PropTypes.any),
  absentTypes: PropTypes.arrayOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  categories: {},
  error: {},
  menuData: [],
  absentTypes: [],
  details: {},
};

export default Index;
