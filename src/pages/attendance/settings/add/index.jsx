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

const getTotalTime = (start, end) => {
  if (!start || !end) return null;
  return moment
    .utc(
      moment
        .duration(moment(end).startOf('second').diff(moment(start).startOf('second')))
        .asMilliseconds(),
    )
    .format(variables.DATE_FORMAT.HOUR);
};
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
const mapStateToProps = ({ schedulesSettingAdd, loading, menu }) => ({
  dataStores: schedulesSettingAdd.dataStores,
  loading: loading,
  error: schedulesSettingAdd.error,
  details: schedulesSettingAdd.details,
  menuData: menu.menuLeftSchedules,
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
        type: 'schedulesSettingAdd/GET_DETAILS',
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
        shift_code: get(details, 'shift_code'),
        store_id: `${get(details, 'store_id')}`,
        time: get(details, 'shiftDetail').map((item) => {
          const start_time = moment(item.start_time, variables.DATE_FORMAT.TIME_FULL);
          const end_time = moment(item.end_time, variables.DATE_FORMAT.TIME_FULL);
          return {
            end_time,
            start_time,
            meal_time: get(item, 'meal_time'),
            total_time: getTotalTime(start_time, end_time),
          };
        }),
        description: get(details, 'description'),
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
        type: 'schedulesSettingAdd/UPDATE',
        payload: {
          ...values,
          id: get(params, 'id'),
          time: values.time.map((item) => ({
            end_time: Helper.getDateTime({
              value: Helper.setDate({
                ...variables.setDateData,
                originValue: item.end_time,
              }),
              format: variables.DATE_FORMAT.TIME_FULL,
              isUTC: false,
            }),
            start_time: Helper.getDateTime({
              value: Helper.setDate({
                ...variables.setDateData,
                originValue: item.start_time,
              }),
              format: variables.DATE_FORMAT.TIME_FULL,
              isUTC: false,
            }),
            meal_time: item.meal_time,
          })),
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
        type: 'schedulesSettingAdd/ADD',
        payload: {
          ...values,
          time: values.time.map((item) => ({
            end_time: Helper.getDateTime({
              value: Helper.setDate({
                ...variables.setDateData,
                originValue: item.end_time,
              }),
              format: variables.DATE_FORMAT.TIME_FULL,
              isUTC: false,
            }),
            start_time: Helper.getDateTime({
              value: Helper.setDate({
                ...variables.setDateData,
                originValue: item.start_time,
              }),
              format: variables.DATE_FORMAT.TIME_FULL,
              isUTC: false,
            }),
            meal_time: item.meal_time,
          })),
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

  onChangeTimePicker = (timeChoose, index, type = 'start_time') => {
    if (this.formRef.current) {
      const { time } = this.formRef.current.getFieldsValue();
      this.formRef.current.setFieldsValue({
        time: time.map((item, indexTime) => {
          if (indexTime === index) {
            let total_time = null;
            if (type === 'start_time' && item.end_time) {
              total_time = getTotalTime(timeChoose, item.end_time);
            }
            if (type === 'end_time' && item.start_time) {
              total_time = getTotalTime(item.start_time, timeChoose);
            }
            return {
              ...item,
              start_time: type === 'start_time' ? timeChoose : item.start_time,
              end_time: type === 'end_time' ? timeChoose : item.end_time,
              total_time,
            };
          }
          return item;
        }),
      });
    }
  };

  disabledHours = (index) => {
    const { getFieldsValue } = this.formRef.current;
    const { time } = getFieldsValue();
    const itemLast = time.find((item, indexTime) => indexTime === index - 1);
    if (get(itemLast, 'start_time') && get(itemLast, 'end_time')) {
      const arrayHours = [];
      const startTime = parseInt(moment(itemLast.start_time).format('H'), 10);
      const endTime = parseInt(moment(itemLast.end_time).format('H'), 10);
      const endTimeMinutes = parseInt(moment(itemLast.end_time).format('m'), 10);
      if (startTime === endTime) {
        if (endTimeMinutes === 59) {
          for (let i = startTime; i <= endTime; i += 1) {
            arrayHours.push(i);
          }
          return arrayHours;
        }
        return [];
      }
      if (startTime < endTime) {
        for (let i = startTime; i < endTime; i += 1) {
          arrayHours.push(i);
        }
      } else {
        for (let i = 0; i < endTime; i += 1) {
          arrayHours.push(i);
        }
        for (let i = startTime; i <= 23; i += 1) {
          arrayHours.push(i);
        }
      }
      return uniqBy(arrayHours);
    }
    return [];
  };

  disabledMinutes = (selectedHour, index, type = 'start_time') => {
    const { getFieldsValue } = this.formRef.current;
    const { time } = getFieldsValue();
    const itemLast = time.find((item, indexTime) => indexTime === index - 1);
    const itemCurrent = time.find((item, indexTime) => indexTime === index);
    const startTimeMinutesCurrent = parseInt(moment(itemCurrent.start_time).format('m'), 10);
    if (get(itemLast, 'start_time') && get(itemLast, 'end_time')) {
      const arrayHours = [];
      const endTime = parseInt(moment(itemLast.end_time).format('H'), 10);
      const startTimeMinutes = parseInt(moment(itemLast.start_time).format('m'), 10);
      const endTimeMinutes = parseInt(moment(itemLast.end_time).format('m'), 10);
      if (selectedHour !== endTime) {
        return [];
      }
      if (type === 'end_time') {
        if (startTimeMinutes < endTimeMinutes) {
          for (let i = startTimeMinutes; i < endTimeMinutes; i += 1) {
            arrayHours.push(i);
          }
          for (let i = endTimeMinutes; i < startTimeMinutesCurrent; i += 1) {
            arrayHours.push(i);
          }
        }
      } else if (startTimeMinutes < endTimeMinutes) {
        for (let i = startTimeMinutes; i < endTimeMinutes; i += 1) {
          arrayHours.push(i);
        }
      }
      return uniqBy(arrayHours);
    }
    return [];
  };

  renderTimeHelper = (index) => {
    if (!this.formRef.current) return <></>;
    const { getFieldsValue } = this.formRef.current;
    const { start_time, end_time } = get(getFieldsValue(), `time.${index}`, {});
    if (!start_time || !end_time) return <></>;
    const range = moment.utc(end_time.diff(start_time)).format('HH:mm');
    return <span>{range}</span>;
  };

  render() {
    const {
      error,
      menuData,
      loading: { effects },
    } = this.props;
    const loading = effects['schedulesSettingAdd/GET_DETAILS'];
    const loadingSubmit =
      effects['schedulesSettingAdd/ADD'] || effects['schedulesSettingAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs last="Tạo mới ca" menu={menuData} />
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
                <Text color="dark">TẠO MỚI CẤU HÌNH CA</Text>
              </div>
              <div className={styles['content-children']}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <FormItem
                      label="MÃ CA"
                      name="shift_code"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                </div>
                <Form.List name="time">
                  {(fields, { add, remove }) => (
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
                          <div className="col-lg-4">
                            <FormItem
                              onSelect={(value) =>
                                this.onChangeTimePicker(value, index, 'start_time')
                              }
                              label="THỜI GIAN TỪ"
                              name={[field.name, 'start_time']}
                              fieldKey={[field.fieldKey, 'start_time']}
                              rules={[variables.RULES.EMPTY]}
                              type={variables.TIME_PICKER}
                            />
                          </div>
                          <div className="col-lg-4">
                            <FormItem
                              onSelect={(value) =>
                                this.onChangeTimePicker(value, index, 'end_time')
                              }
                              label="ĐẾN"
                              name={[field.name, 'end_time']}
                              fieldKey={[field.fieldKey, 'end_time']}
                              rules={[variables.RULES.EMPTY]}
                              type={variables.TIME_PICKER}
                            />
                          </div>
                          <div className="col-lg-4">
                            <Form.Item label={<span>Tổng thời gian</span>} shouldUpdate>
                              {({ getFieldValue }) => {
                                const total_time = get(
                                  getFieldValue('time'),
                                  `${index}.total_time`,
                                );
                                return total_time;
                              }}
                            </Form.Item>
                          </div>
                          <>
                            {fields?.length > 1 ? (
                              <DeleteOutlined
                                className={classnames(stylesModule['icon-delete'], 'ml-1')}
                                onClick={() => {
                                  remove(field.name);
                                }}
                              />
                            ) : null}
                          </>
                        </div>
                      ))}
                      <div className="row mb-3">
                        <div className="col-lg-3">
                          <Button
                            color="success"
                            icon="plusMain"
                            onClick={() => {
                              add();
                            }}
                          >
                            Thêm dòng
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Form.List>
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
